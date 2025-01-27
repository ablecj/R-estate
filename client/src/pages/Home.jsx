import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeCarousel from "../components/HomeCarousal";
import ListingItem from "../components/ListingItem";

const Home = () => {
  // state for saving offerListings
  const [offerListings, setOfferListings] = useState([]);
  // state for salesListing
  const [salesListings, setSalesListings] = useState([]);
  // state for rentListings
  const [rentListings, setRentListings] = useState([]);

  console.log(salesListings, "salesLisatings");
  console.log(offerListings, "offerListings");
  console.log(rentListings, "rentListings");

  // useEffect to load the listings data when the page loads
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    // callback function for fetching the rent listings if the offerListings data is there
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    // callback function for fetching the saleListings if the rentListings is there
    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSalesListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* {?top  } */}
      <div
        className="flex flex-col gap-6 p-28 px-3
        mx-auto max-w-6xl"
      >
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          REstate is the best place to find your next perfect place to live
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800
          font-bold hover:underline"
        >
          let's get started
        </Link>
      </div>

      {/* swiper */}
      <div>
        {/* Other components or content */}
        {offerListings && offerListings.length > 0 && (
          <HomeCarousel offerListings={offerListings} />
        )}
      </div>

      {/* listing result of offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col
        gap-8 my-10">
          {
            offerListings && offerListings.length > 0 && (
              <div className="">
                <div className="">
                  <h2>Recent offers</h2>
                  <Link to={'/search?offer=true'}>
                    Show more offers...
                  </Link>
                </div>
                  <div className="flex flex-wrap gap-4">
                    {
                      offerListings.map((listing, index)=> (
                        <ListingItem listing={listing} key={index} />
                      ))
                    }
                  </div>
              </div>
            )
          }
        </div>
      
    </div>
  );
};

export default Home;
