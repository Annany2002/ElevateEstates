import express from "express";
import dotenv from "dotenv";
import connect from "../connection.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingsRouter from "./routes/listing.route.js";
import path from "path";

dotenv.config();
connect(process.env.MONGO);

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
