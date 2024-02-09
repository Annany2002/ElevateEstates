import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [location.search]);

  return (
    <header className="bg-gray-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Elevate</span>
            <span className="text-slate-700">Estates</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden text-slate-800 hover:underline font-semibold sm:inline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden text-slate-800 hover:underline font-semibold sm:inline">
              {" "}
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="userImage"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <li className="text-slate-800 hover:underline font-semibold">
                {" "}
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
