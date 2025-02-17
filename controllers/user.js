import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import randomstring from "randomstring";
import Account from "../models/account.js";
import logActivity from "../utils/logActivity.js";
import {
	confirmRegistrationMessage,
	contactMessage,
	feedbackMessage,
	loginMessage,
	otpMessage,
	registerMessage,
} from "../utils/message.js";
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
			const otp = randomstring.generate({
				length: 6,
				charset: "numeric",
			});
			const newUser = await new User({
				fullName: formData.fullName,
				email: formData.email,
				password: await bcrypt.hash(formData.password, 10),
				status: "Blocked",
				otp: otp,
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

				await sendMail(
					saveUser.email,
					"Registration confirmation",
					confirmRegistrationMessage(saveUser.fullName, saveUser.otp)
				);

				res.json({
					status: true,
					message: "Otp sent to your email to complete registration",
					data: null,
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

const confirmRegistration = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const user = await User.findOne({ email: formData.email });
		if (!user) {
			return res.json({ status: false, message: "User not found" });
		}

		if (user.otp !== formData.otp) {
			return res.json({ status: false, message: "Invalid OTP" });
		}

		const otp = randomstring.generate({
			length: 6,
			charset: "numeric",
		});

		await User.findByIdAndUpdate(
			user._id,
			{
				status: "Active",
				otp: otp,
			},
			{ new: true, useFindAndModify: false }
		);

		await sendMail(
			user.email,
			"Welcome to Bitoption",
			registerMessage(user.fullName)
		);

		res.json({
			status: true,
			message: "User created successfully",
			data: null,
		});
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
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
			return res.json({ status: false, message: "User not found", data: null });
		}

		if (user.status !== "Active") {
			return res.json({
				status: false,
				message: "User Account Disabled. please contact Admin",
				data: null,
			});
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
			await sendMail(
				user.email,
				"Login Notification",
				loginMessage(user.fullName, user.lastLogin[user.lastLogin.length - 1])
			);
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
			return res.json({ status: false, message: "User not found", data: null });
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
			return res.json({
				status: false,
				message: "Unable to update OTP",
				data: null,
			});
		}
		// console.log("email: ", user.email);
		await sendMail(
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
			return res.json({ status: false, message: "User not found", data: null });
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
			return res.json({ status: false, message: "User not found", data: null });
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
		const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header

		if (!token) {
			return res.status(400).json({
				status: false,
				message: "No token provided",
				data: null,
			});
		}

		// Add the token to the blacklist
		tokenBlacklist.set(token, true);

		res.json({
			status: true,
			message: "Logged out successfully",
			data: null,
		});
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const changePassword = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const user = await User.findById(req.user.id);
		const confirmPassword = bcrypt.compareSync(
			formData.oldPassword,
			user.password
		);
		if (confirmPassword) {
			await User.findByIdAndUpdate(
				user._id,
				{
					password: await bcrypt.hash(formData.newPassword, 10),
				},
				{ new: true, useFindAndModify: false }
			);
			res.json({
				status: true,
				message: "Password Updated Successfully",
				data: null,
			});
		} else {
			res.json({
				status: true,
				message: "Old Password does not match",
				data: null,
			});
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
});

const sendFeedback = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const { feedbackType, message } = formData;
		const user = await User.findById(req.user.id);

		await sendMail(
			"godwindanielgodwin@gmail.com",
			"Users Feedback from Settings",
			feedbackMessage(user.fullName, feedbackType, message)
		);

		res.json({ status: true, message: "Message Sent", data: null });
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
});

const contactUsMessage = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const { firstName, lastName, email, subject, message } = formData;

		await sendMail(
			"godwindanielgodwin@gmail.com",
			"Contact Form Feedback",
			contactMessage(firstName, lastName, email, subject, message)
		);

		res.json({ status: true, message: "Message Sent", data: null });
	} catch (error) {
		res.status(500).json({ status: false, message: error.message });
	}
});

const getAllUsers = asyncHandler(async (req, res) => {
	try {
		const users = await User.find({}).sort({ createdAt: -1 });
		if (users) {
			res.json({ status: true, message: "users retrieved", data: users });
		} else {
			res.json({
				status: false,
				message: "unable to retrieve users",
				data: null,
			});
		}
	} catch (error) {
		res.status(500).json({ status: false, message: error.data.message });
	}
});

const updateUserStatus = asyncHandler(async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findById(id);
		if (!user) {
			return res.json({ status: false, message: "User not found", data: null });
		}

		const updateUser = await User.findByIdAndUpdate(
			user._id,
			{
				status: user.status === "Active" ? "Blocked" : "Active",
			},
			{ new: true, useFindAndModify: false }
		);

		if (!updateUser) {
			return res.json({
				status: false,
				message: "unable to update user's status",
				data: null,
			});
		}

		res.json({
			data: null,
			status: true,
			message: "User Status Updated successfully",
		});
	} catch (error) {
		res.status(500).json({ status: false, message: error?.data?.message });
	}
});

const updateUser = asyncHandler(async (req, res) => {
	try {
		const id = req.params.id;
		const formData = req.body.payload;
		const user = await User.findById(id);
		if (!user) {
			return res.json({ status: false, message: "User not found", data: null });
		}

		await User.findByIdAndUpdate(
			user._id,
			{
				fullName: formData.fullName ? formData.fullName : user.fullName,
				email: formData.email ? formData.email : user.email,
				password: formData.password
					? await bcrypt.hash(formData.password, 10)
					: user.password,
			},
			{ new: true }
		);

		res.json({
			data: null,
			status: true,
			message: "User Status Updated successfully",
		});
	} catch (error) {
		res.status(500).json({ status: false, message: error });
	}
});

export {
	registerUser,
	authUser,
	validateAccount,
	verifyOtp,
	resetPassword,
	logout,
	changePassword,
	contactUsMessage,
	sendFeedback,
	getAllUsers,
	updateUserStatus,
	confirmRegistration,
	updateUser,
};
