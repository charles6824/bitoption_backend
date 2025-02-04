import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import randomstring from "randomstring";
import Account from "../models/account.js";
import logActivity from "../utils/logActivity.js";
import { otpMessage } from "../utils/message.js";
import sendMail from "../services/sendMail.js";
import { v4 as uuidv4 } from "uuid";
import NodeCache from "node-cache";
import { tokenBlacklist } from "../middleware/authMiddleware.js";

// Initialize cache with a default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

const registerUser = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;

		const userExist = await User.findOne({ email: formData.email });
		if (userExist) {
			res.json({ status: false, message: "User already exists", data: null });
		} else {
			const newUser = await new User({
				fullName: formData.fullName,
				email: formData.email,
				password: await bcrypt.hash(formData.password, 10),
			});

			const saveUser = await newUser.save();
			if (saveUser) {
				let accountNumber;
				let existingAccount;

				do {
					const randomNumber = randomstring.generate({
						length: 7,
						charset: "numeric",
					});

					accountNumber = "010" + randomNumber;

					existingAccount = await Account.findOne({ accountNumber });
				} while (existingAccount);

				const newAccount = new Account({
					user: saveUser._id,
					currency: formData.currency ? formData.currency : "USD",
					accountNumber,
				});

				const saveAccount = await newAccount.save();

				await User.findByIdAndUpdate(
					saveUser._id,
					{ accountNumber: accountNumber },
					{ new: true, useFindAndModify: false }
				);

				const saveDetails = {
					id: saveUser._id,
					fullName: saveUser.fullName,
					email: saveUser.email,
				};

				const response = {
					accountDetails: saveAccount,
					userDetails: saveDetails,
				};

				res.json({
					status: true,
					message: "User created successfully",
					data: response,
				});
			} else {
				res.json({
					status: false,
					message: "Unable to create User, please contact Admin",
					data: null,
				});
			}
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const authUser = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;

		const user = await User.findOne({
			$or: [
				{ email: formData.email },
				{ accountNumber: formData.accountNumber },
			],
		});

		if (!user) {
			return res
				.status(404)
				.json({ status: false, message: "User not found", data: null });
		}

		const confirmPassword = bcrypt.compareSync(
			formData.password,
			user.password
		);

		if (confirmPassword) {
			user.lastLogin.push(new Date());
			await user.save();

			const userDetails = {
				fullName: user.fullName,
				email: user.email,
				lastLogin: user.lastLogin[user.lastLogin.length - 1],
			};

			const accountDetails = await Account.findOne({ user: user._id });

			const response = {
				token: generateToken(user._id),
				userDetails,
				accountDetails,
			};

			res.json({ status: true, message: "Login Successful", data: response });
		} else {
			res.json({ status: false, message: "Wrong Credentials", data: null });
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const validateAccount = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const user = await User.findOne({ email: formData.email });
		if (!user) {
			return res
				.status(404)
				.json({ status: false, message: "User not found", data: null });
		}
		const otp = randomstring.generate({
			length: 6,
			charset: "numeric",
		});
		const updateOtp = await User.findByIdAndUpdate(
			user._id,
			{
				otp: otp,
			},
			{ new: true, useFindAndModify: false }
		);

		if (!updateOtp) {
			return res
				.status(404)
				.json({ status: false, message: "Unable to update OTP", data: null });
		}
		sendMail(
			user.email,
			"OTP Verification",
			otpMessage(user.fullName, otp)
		);
		res.json({ status: true, message: "OTP sent via email", data: user.email });
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const verifyOtp = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const user = await User.findOne({ email: formData.email });
		if (!user) {
			return res
				.status(404)
				.json({ status: false, message: "User not found", data: null });
		}

		if (user.otp === formData.otp) {
			// Generate a UUID tracking code
			const trackingCode = uuidv4();

			// Store the tracking code in the cache with the user's email as the key
			cache.set(user.email, trackingCode);

			res.json({
				status: true,
				message: "OTP verified",
				data: { trackingCode },
			});
		} else {
			res.json({ status: false, message: "Invalid OTP", data: null });
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const resetPassword = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const user = await User.findOne({ email: formData.email });

		if (!user) {
			return res
				.status(404)
				.json({ status: false, message: "User not found", data: null });
		}

		// Retrieve the tracking code from the cache
		const cachedTrackingCode = cache.get(user.email);

		// Validate the tracking code
		if (cachedTrackingCode && cachedTrackingCode === formData.trackingCode) {
			const updatePassword = await User.findByIdAndUpdate(
				user._id,
				{
					password: await bcrypt.hash(formData.password, 10),
				},
				{ new: true, useFindAndModify: false }
			);

			if (!updatePassword) {
				return res.json({
					status: false,
					message: "Unable to update Password",
					data: null,
				});
			}

			// Clear the tracking code from the cache after successful password reset
			cache.del(user.email);

			res.json({
				status: true,
				message: "Password reset successful",
				data: null,
			});
		} else {
			res.status(400).json({
				status: false,
				message: "Invalid request, contact admin",
				data: null,
			});
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const logout = asyncHandler(async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

      if (!token) {
          return res.status(400).json({
              status: false,
              message: 'No token provided',
              data: null,
          });
      }

      // Add the token to the blacklist
      tokenBlacklist.set(token, true);

      res.json({
          status: true,
          message: 'Logged out successfully',
          data: null,
      });
  } catch (err) {
      res.status(500).json({ status: false, message: err.message });
  }
});

export { registerUser, authUser, validateAccount, verifyOtp, resetPassword, logout };