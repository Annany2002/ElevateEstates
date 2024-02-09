import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const userData = await response.json();
      if (userData.success === false) {
        dispatch(signInFailure(userData.message));
        return;
      }
      dispatch(signInSuccess(userData));
      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form onSubmit={handleSubmit} action="#" className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="email"
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
        />
        <input
          onChange={handleChange}
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="font-medium">New to our platform?</p>
        <Link to={"/sign-up"}>
          <span className="text-slate-700 font-semibold hover:underline">
            Sign Up
          </span>
        </Link>
      </div>
      {error && (
        <p className="text-red-600 text-xl text-center mt-5">{error}</p>
      )}
    </div>
  );
}
