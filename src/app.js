import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import ItemRouter from "./routes/item.routes.js";
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
// Add this line to parse JSON request bodies

app.use("/api/auth", authRouter);
app.use("/api/item", ItemRouter);

export default app;
// app.get("/", async (req, res) => {
//   res.send("hello world");
// });

// //

// app.get("/get-user", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const userDetails = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//       select: {
//         username: true,
//       },
//     });
//     res.json(userDetails);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// app.delete("/delete-user", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const userDeleted = await prisma.user.delete({
//       where: {
//         email: email,
//       },
//     });
//     if (!userDeleted) {
//       return res.json(
//         { message: "user not deleted" },
//         {
//           status: 400,
//         },
//       );
//     }
//     console.log("user is deleted");
//     return res.json({ message: "user deleted successfully" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });
