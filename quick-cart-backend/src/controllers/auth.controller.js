import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import sendApprovalMail from "../utilities/sendApprovalMail.js";
import sendMail from "../utilities/sendMail.js";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "Customer account created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credentials!" });

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid Credentials!" });

    // Generate cookie token and send to the user
    const age = 1000 * 60 * 60 * 24 * 7; // 7 days

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        //secure:true
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// Logout a user
export const logoutUser = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};

// Create a seller
export const createSeller = async (req, res) => {
  const {
    name,
    email,
    password,
    businessName,
    phoneNumber,
    address,
    city,
    state,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    // Create a unique token for approval
    const approvalToken = crypto.randomBytes(32).toString('hex');

    // Create the seller (user) with isApproved set to false
    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName,
        phoneNumber,
        address,
        city,
        state,
        role: "seller",
        isApproved: false,
        approvalToken, 
      },
    });

    // Create the store with the correct owner name and reference, including the email field
    const store = await prisma.store.create({
      data: {
        name,
        businessName,
        phoneNumber,
        address,
        email,
        city,
        state,
        ownerId: seller.id,
      },
    });

    // Update the user's storeId with the newly created store's id
    await prisma.user.update({
      where: { id: seller.id },
      data: { storeId: store.id },
    });

    // Send approval request email to admin
    await sendApprovalMail({
      to: process.env.ADMIN_EMAIL,
      subject: "Approval Request for New Seller",
      sellerName: name,
      approvalLink: `${process.env.APP_URL}/approve-seller/${approvalToken}`,
    });

    res.status(201).json({ message: "Seller account created successfully, pending approval." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve a seller
export const approveSeller = async (req, res) => {
  const { token } = req.params;

  try {
    const seller = await prisma.user.findFirst({
      where: { approvalToken: token },
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update the seller to be approved
    await prisma.user.update({
      where: { id: seller.id },
      data: {
        isApproved: true,
        approvalToken: null,
      },
    });

    // Notify the seller
    await sendMail({
      email: seller.email,
      subject: "Your Seller Account Has Been Approved",
      message: `Congratulations ${seller.name}, your seller account has been approved!`,
    });

    res.status(200).json({ message: "Seller approved successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};