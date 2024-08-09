import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma.js";
import jwt from "jsonwebtoken";

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
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail)
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });

    const seller = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName,
        phoneNumber,
        address,
        role: "seller",
      },
    });

    const store = await prisma.store.create({
      data: {
        name: businessName,
        phoneNumber,
        address
      },
    });

    // Update the user's storeId with the newly created store's id
    await prisma.user.update({
      where: { id: seller.id },
      data: { storeId: store.id },
    });

    res.status(201).json({ message: "Seller account created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

