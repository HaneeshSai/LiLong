const jwtUtils = require("../utils/jwtUtils");
const prisma = require("../db/prismaClient");
const bcrypt = require("bcrypt");

async function createAccount(req, res) {
  const { email, password, displayName, pfp } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      return res
        .status(500)
        .json({ error: "A user with this Email Already Exists" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: {
        email: email,
        name: displayName,
        password: hashedPass,
        profile_pic: pfp.toString(),
      },
    });

    const token = jwtUtils.generateToken({ userId: createUser.user_id });
    const name = displayName;
    const profile_pic = pfp;

    return res.status(201).json({
      message: "Account created successfully",
      token,
      name,
      profile_pic,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(500)
        .json({ error: "User with this email does not Exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(500).json({ error: "Invalid Credentials" });
    } else {
      const token = jwtUtils.generateToken({ userId: user.user_id });
      const name = user.name;
      const profile_pic = user.profile_pic;
      return res.json({
        message: "Login successful",
        token,
        name,
        profile_pic,
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Add functions for password recovery, etc.

module.exports = {
  createAccount,
  login,
  // Add other functions as needed.
};
