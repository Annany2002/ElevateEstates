import { Route, Routes, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import CreateListings from "./pages/CreateListings";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UpdateListings from "./pages/UpdateListings";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listings />} />
        <Route element={<PrivateRoute />}>
          <Route path="/create-listings" element={<CreateListings />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/update-listings/:listingId"
            element={<UpdateListings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
