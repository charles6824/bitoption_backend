import asyncHandler from "express-async-handler";
import { decryptData } from "../utils/decrypt.js";
import { encryptData } from "../utils/encrypt.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import randomstring from "randomstring";
import Account from "../models/account.js";
import logActivity from "../utils/logActivity.js";

/*
  openapi: 3.0.0
info:
  title: User Authentication API
  description: API for user authentication, registration, and account management
  version: 1.0.0
servers:
  - url: http://localhost:5000/api/users
    description: Local development server
paths:
  /register:
    post:
      summary: Register a new user
      description: Creates a new user account with an associated account number
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                payload:
                  type: object
                  properties:
                    fullName:
                      type: string
                      example: John Doe
                    email:
                      type: string
                      example: johndoe@example.com
                    password:
                      type: string
                      example: StrongPassword123!
                    currency:
                      type: string
                      example: USD
      responses:
        "201":
          description: User registered successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: User created successfully
                  data:
                    type: object
                    properties:
                      accountDetails:
                        type: object
                      userDetails:
                        type: object
        "400":
          description: Bad request (e.g., missing fields, invalid email, or password too weak)
  /auth:
    post:
      summary: Authenticate user
      description: Logs in a user and returns an authentication token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                payload:
                  type: object
                  properties:
                    email:
                      type: string
                      example: johndoe@example.com
                    accountNumber:
                      type: string
                      example: 0101234567
                    password:
                      type: string
                      example: StrongPassword123!
      responses:
        "200":
          description: User authenticated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: Login Successful
                  data:
                    type: object
                    properties:
                      token:
                        type: string
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
                      userDetails:
                        type: object
                      accountDetails:
                        type: object
        "401":
          description: Unauthorized (invalid credentials)
        "404":
          description: User not found

 */

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

				const response = {
					accountDetails: saveAccount,
					userDetails: saveUser,
				};
				const currentDate = new Date();
				logActivity(
					saveUser._id,
					"Account Creation",
					currentDate,
					"successful",
					"Account Creation initiated Successfully"
				);

				res.json({
					status: true,
					message: "User created successfully",
					data: response,
				});
			} else {
				const currentDate = new Date();
				logActivity(
					saveUser._id,
					"Account Creation",
					currentDate,
					"failed",
					"Account Creation Failed"
				);
				res.json({
					status: false,
					message: "unable to create User, please contact Admin",
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

			const currentDate = new Date();

			logActivity(
				user._id,
				"Login",
				currentDate,
				"successful",
				"Login initiated Successfully"
			);

			res.json({ status: true, message: "Login Successful", data: response });
		} else {
			const currentDate = new Date();
			logActivity(
				user._id,
				"Login",
				currentDate,
				"failed",
				"Login initiation failed"
			);
			res.json({ status: false, message: "Wrong Credentials", data: null });
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const validateAccount = asyncHandler(async (req, res) => {
	try {
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

const verifyOtp = asyncHandler(async (req, res) => {});

const resetPassword = asyncHandler(async (req, res) => {});

export { registerUser, authUser };
