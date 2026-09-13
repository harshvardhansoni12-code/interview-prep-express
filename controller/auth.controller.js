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
    const accessToken = jwt.sign(
      {
        userId: userExist.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    //
    console.log(accessToken);

    const refreshToken = jwt.sign(
      {
        userId: userExist.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );
    console.log(refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      message: "Login successful",
      accessToken,
    });
  } catch (e) {
    return res.status(500).json({ message: "internal server error" });
  }
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "no refresh token ecist",
    });
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  const accessToken = jwt.sign(
    {
      id: decoded.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  //
  return res.status(201).json({
    message: "Access token refreshed successfully",
  });
}

export { register, login, refreshToken };
//42:00
