import asyncHandler from "express-async-handler";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const createAdmin = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;
		const admin = await Admin.findOne({ email: formData.email });
		if (!admin) {
			const newAdmin = await new Admin({
				fullName: formData.fullName,
				email: formData.email,
				password: await bcrypt.hash(formData.password, 10),
			});
			const saveAdmin = await newAdmin.save();
			if (saveAdmin) {
				res.json({
					status: true,
					message: "Admin created successfully",
					data: null,
				});
			} else {
				res.json({
					status: false,
					message: "Failed to create admin",
					data: null,
				});
			}
		} else {
			res.json({ status: false, message: "Admin already exists", data: null });
		}
	} catch (err) {
		console.log(err);
		throw new Error(err);
	}
});

export const authAdmin = asyncHandler(async (req, res) => {
	try {
		const formData = req.body.payload;

		const admin = await Admin.findOne({
			$or: [{ email: formData.email }],
		});

		if (!admin) {
			return res.json({
				status: false,
				message: "Admin not found",
				data: null,
			});
		}

		const confirmPassword = bcrypt.compareSync(
			formData.password,
			admin.password
		);

		if (confirmPassword) {
			admin.lastLogin.push(new Date());
			await admin.save();

			const response = {
				token: generateToken(admin._id),
				data: {
					fullName: admin.fullName,
					email: admin.email,
				},
			};

			res.json({ status: true, message: "Login Successful", data: response });
		} else {
			res.json({ status: false, message: "Wrong Credentials", data: null });
		}
	} catch (err) {
		res.status(500).json({ status: false, message: err.message });
	}
});

export const logout = asyncHandler(async (req, res) => {
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

export const changePassword = asyncHandler(async(req, res) => {
  try {
    const formData = req.body.payload
    const admin = await Admin.findById(req.admin.id)
    const confirmPassword = bcrypt.compareSync(
			formData.oldPassword,
			admin.password
		);
    if(confirmPassword){
      await Admin.findByIdAndUpdate(
				admin._id,
				{
					password: await bcrypt.hash(formData.newPassword, 10),
				},
				{ new: true, useFindAndModify: false }
			);
      res.json({status: true, message: "Password Updated Successfully", data: null})
    }else{
      res.json({status: true, message: "Old Password does not match", data: null})
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
})