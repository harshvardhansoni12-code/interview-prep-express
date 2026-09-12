import jwt from "jsonwebtoken";
async function ItemCreate(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "user not authenticated" });
    }
    const realToken = token.split(" ")[1];
    if (!realToken) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }
    const userInfo = jwt.verify(realToken, process.env.JWT_SECRET);

    return res.status(200).json({ email: userInfo.email });
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

export { ItemCreate };
