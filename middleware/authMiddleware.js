import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';
import NodeCache from 'node-cache';

// Initialize cache for token blacklist
const tokenBlacklist = new NodeCache({ stdTTL: 600 }); // Tokens are blacklisted for 10 minutes

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with 'Bearer'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Check if the token is in the blacklist
            if (tokenBlacklist.has(token)) {
                return res.status(401).json({
                    status: false,
                    message: "Token is invalidated. Please log in again.",
                    data: null,
                });
            }

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({
                status: false,
                message: 'Not authorized, token failed',
                data: null,
            });
        }
    }

    // If no token is provided
    if (!token) {
        res.status(401).json({
            status: false,
            message: 'Not authorized, no token', 
            data: null,
        });
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({
            status: false,
            message: 'Not authorized as an admin',
            data: null,
        });
    }
};

const user = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({
            status: false,
            message: 'Not authorized as a user',
            data: null,
        });
    }
};

// Export the tokenBlacklist for use in the logout function
export { protect, admin, user, tokenBlacklist };