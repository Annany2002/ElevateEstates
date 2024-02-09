import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  // console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const getListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listings/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };
    getListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const showMoreListings = async () => {
    const currListings = listings.length;
    const startIndex = currListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const urlQuery = urlParams.toString();
    const res = await fetch(`/api/listings/get?${urlQuery}`);
    const data = await res.json();
    if (data.length > 9) {
      setShowMore(false);
      setListings([...listings, ...data]);
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              className="border rounded-lg p-3"
              id="sort"
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
            >
              <option value={"regularPrice_desc"}>Price: High to Low</option>
              <option value={"regularPrice_asc"}>Price: Low to High</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <div className="flex justify-center w-full">
            <button className="text-white bg-slate-500 px-8 py-2 rounded-lg uppercase hover:opacity-95">
              Search
            </button>
          </div>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-medium text-slate-700 border-b p-3 mt-3">
          Listings Result:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl font-medium text-slate-700">
              No Listings found!!!
            </p>
          )}
          {loading && (
            <p className="text-xl text-gray-800 text-center">Loading!!!</p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={() => showMoreListings}
              className="text-green-600 font-normal hover:underline p-7 w-full text-center"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
