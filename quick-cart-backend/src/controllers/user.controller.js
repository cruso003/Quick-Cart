import sendSecurityCode from '../utilities/sendSecurityCode.js';
import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import generateOTP from '../utilities/generateOTP.js';


// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user by email
export const updateUserByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const { password, ...input } = req.body;

        let updatedPassword = null;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedPassword = hashedPassword;
        }

        const user = await prisma.user.update({
            where: { email: userEmail },
            data: { 
                ...(updatedPassword && { password: updatedPassword }), 
                ...input 
            }
        });

        const { password: userPassword, ...rest } = user;

        res.status(200).json({ success: true, message: "User updated successfully", data: rest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add delivery address
export const addDeliveryAddress = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const { deliveryAddress } = req.body;

        const user = await prisma.user.update({
            where: { email: userEmail },
            data: {
                deliveryAddresses: {
                    create: deliveryAddress
                }
            }
        });

        res.status(200).json({ success: true, message: "Delivery address added successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update user address
export const updateAddressById = async (req, res) => {
    try {
        const addressId = parseInt(req.params.addressId);
        const { name, street, landmark, city, state, mobileNo, postalCode } = req.body;

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                deliveryAddresses: {
                    update: {
                        where: { id: addressId },
                        data: { name, street, landmark, city, state, mobileNo, postalCode }
                    }
                }
            }
        });

        res.status(200).json({ success: true, message: "Address updated successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove user address
export const removeAddressById = async (req, res) => {
    try {
        const addressId = parseInt(req.params.addressId);

        const user = await prisma.user.update({
            where: { id: req.userId },
            data: {
                deliveryAddresses: {
                    delete: { id: addressId }
                }
            }
        });

        res.status(200).json({ success: true, message: "Address removed successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const securityCode = generateOTP();
        await prisma.user.update({
            where: { email },
            data: {
                securityCode,
                securityCodeExpires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            }
        });

        await sendSecurityCode(email, securityCode);
        res.status(200).json({ success: true, message: "Security code sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify OTP and reset password
export const verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, securityCode, newPassword } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.securityCode !== securityCode || user.securityCodeExpires < new Date()) {
            return res.status(400).json({ success: false, message: "Invalid or expired security code" });
        }

         // Hash the password
         const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                securityCode: null,
                securityCodeExpires: null
            }
        });

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Resend security code
export const resendSecurityCode = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const now = new Date();
        const isCodeValid = user.securityCodeExpires && user.securityCodeExpires > now;

        if (isCodeValid) {
            return res.status(400).json({ success: false, message: "A security code has already been sent. Please use the existing code." });
        }

        // Generate new security code and update in the database
        const securityCode = generateOTP();
        await prisma.user.update({
            where: { email },
            data: {
                securityCode,
                securityCodeExpires: new Date(Date.now() + 30 * 60 * 1000)
            }
        });

        // Send the new security code via email
        await sendSecurityCode(email, securityCode);
        res.status(200).json({ success: true, message: "New security code sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

