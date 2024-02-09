import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Listings from "../models/listings.model.js";
import { errorHandler } from "../utils/error.js";

export async function updateUser(req, res, next) {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Permission not allowed"));

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 12);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "Access Denied"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User deleted");
  } catch (error) {
    next(error);
  }
}

export async function getUserListings(req, res, next) {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listings.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}
