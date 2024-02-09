import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const userData = await response.json();
      if (userData.success === false) {
        setError(userData.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold text-center my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} action="#" className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="text"
          className="border p-3 rounded-lg"
          placeholder="username"
          id="username"
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p className="font-medium">Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-slate-500 font-semibold hover:underline">
            Sign In
          </span>
        </Link>
      </div>
      {error && (
        <p className="text-red-600 text-xl text-center mt-5">{error}</p>
      )}
    </div>
  );
}
