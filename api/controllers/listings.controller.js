import Listing from "../models/listings.model.js";
import { errorHandler } from "../utils/error.js";

export async function createListings(req, res, next) {
  try {
    const listings = await Listing.create(req.body);
    return res.status(201).json(listings);
  } catch (error) {
    next(error);
  }
}

export async function deleteListings(req, res, next) {
  const listings = await Listing.findById(req.params.id);
  if (!listings) {
    return res.status(404).json("Listings not found");
  }
  if (listings.userRef !== req.user.id) {
    return res
      .status(403)
      .json("You are not authorized to delete this listing");
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listings deleted");
  } catch (error) {
    next(error);
  }
}

export async function updateListings(req, res, next) {
  const listings = await Listing.findById(req.params.id);
  if (!listings) {
    return next(errorHandler(404, "User not found"));
  }
  if (listings.userRef !== req.user.id) {
    return next(
      errorHandler(401, "You are not authorized to update this listing")
    );
  }
  try {
    const updatedListings = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedListings);
  } catch (error) {
    next(error);
  }
}

export async function getListing(req, res, next) {
  try {
    const listings = await Listing.findById(req.params.id);
    if (!listings) return next(errorHandler(404, "Listings not found"));
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export async function getListings(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === "false" || offer === undefined) {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === "false" || furnished === undefined) {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === "false" || parking === undefined) {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === "sale" || type === "rent" || type === undefined) {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}
