import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  // state for saving the sidebar data
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  // state for handling the loading effect
  const [loading, setLoading] = useState(false);
  // state for storing the listings from the backend 
  const [listings, setListings] = useState([]);
  console.log(listings, 'listings');

  //  useEffect to fetch the search term
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking") === "true";
    const furnishedFromUrl = urlParams.get("furnished") === "true";
    const offerFromUrl = urlParams.get("offer") === "true";
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
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl || false,
        furnished: furnishedFromUrl || false,
        offer: offerFromUrl || false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
  
    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };
  
    fetchListings();
  }, [location.search]);
  

  // handleChang function to track down the changes inside the form
  const handleChange = (e) => {
    // conditonal check for which is checked
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    // condtional check for tracking the values inside the search input
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    // conditional check for parking and furnished
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    // conditional check for sort and order
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };
  // navigate using useNavigate hook
  const navigate = useNavigate();

  // handleSubmit function for submitting the form
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search Here..!"
              className="border rounded-lg p-3 w-full 
                focus:outline-none"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div
            className="flex gap-2 flex-wrap 
              items-center"
          >
            <label className="font-semibold"> Type: </label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div
            className="flex gap-2 flex-wrap 
              items-center"
          >
            <label className="font-semibold"> Amenities: </label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg 
                  p-3 focus:outline-none"
            >
              <option value="regularPrice_desc">Price hight to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            className="bg-slate-700 text-white p-3 
            rounded-lg uppercase hover:opacity-75 "
          >
            Search
          </button>
        </form>
      </div>

      <div className="">
        <h1
          className="text-3xl font-semibold border-b 
          p-3 text-slate-700 mt-5"
        >
          Listings Result
        </h1>
      </div>
    </div>
  );
};

export default Search;
