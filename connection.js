import mongoose from "mongoose";

export default function connect(url) {
  mongoose
    .connect(url)
    .then(console.log("Database connected"))
    .catch(err => console.log(err));
}