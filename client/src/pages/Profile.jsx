import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";

export default function Profile() {
  const imgRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercent, setFilePercent] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercent(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const userData = await res.json();
      if (userData.success === false) {
        dispatch(updateUserFailure(userData.message));
        return;
      }
      dispatch(updateUserSuccess(userData));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const userData = await res.json();
      if (userData.success === false) {
        dispatch(deleteUserFailure(userData.message));
        return;
      }
      dispatch(deleteUserSuccess(userData));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const signOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/sign-out");
      const userData = await res.json();
      if (userData.success === false) {
        dispatch(signOutUserFailure(userData.message));
        return;
      }
      dispatch(signOutUserSuccess(userData));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const listings = await res.json();
      if (listings.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(listings);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listings/delete/${id}`, {
        method: "DELETE",
      });
      const listingData = await res.json();
      if (listingData.success === false) {
        console.log(listingData.message);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleUpdateListing = async (id) => {};
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-slate-800 text-center font-semibold my-7">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="images/*"
          type="file"
          ref={imgRef}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          className="rounded-full w-24 h-24 mb-2 cursor-pointer object-cover self-center"
          alt="profile"
          onClick={() => imgRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercent}%`}</span>
          ) : filePercent === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-600 text-center text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          to={"/create-listings"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDelete}
          className="text-lg text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={signOut} className="text-lg text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5 text-center font-medium">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="w-full text-green-800 font-medium p-2"
      >
        Show Listings
      </button>
      <p className="text-red-600 mt-5">
        {showListingsError ? "Error in showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-600 text-2xl font-semibold text-center mt-7">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="p-3 flex gap-4 justify-between items-center bodrer rounded-lg"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing-cover"
                  className="w-16 h-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-800 font-semibold flex-1 truncate hover:underline"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-600 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listings/${listing._id}`}>
                  <button className="text-green-600 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
