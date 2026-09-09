import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email or username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userCreated = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    if (!userCreated) {
      return res.status(400).json({ message: "user not created" });
    }

    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ message: "incomplete cred" });
  }
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!userExist) {
      return res.status(404).json({ message: "user not found" });
    }
    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      return res.status(409).json({ message: "incorrect password" });
    }

    // jwt token is created
    const token = jwt.sign(
      {
        userId: userExist.id,
        email: userExist.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    //
    console.log(token);
    res.json({
      message: "Login successful",
      token,
    });
  } catch (e) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export { register, login };
//42:00
