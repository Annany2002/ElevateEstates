import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createListings,
  deleteListings,
  getListing,
  getListings,
  updateListings,
} from "../controllers/listings.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createListings);
router.delete("/delete/:id", verifyUser, deleteListings);
router.post("/update/:id", verifyUser, updateListings);
router.get("/get/:id", getListing);
router.get("/get", getListings);

export default router;
