import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingCarousel from "../components/ListingCarousel";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from "../components/Contact";

const Listing = () => {
  const params = useParams();
  // state for storing the fetched list data
  const [listing, setListing] = useState(null);
  console.log(listing, "listing !")
  // stae for handling the loading
  const [loading, setLoading] = useState(true);
  // state for handling Error
  const [error, setError] = useState(false);
  // state for copying the link from share icon
  const [copied, setCopied] = useState(false);
  
  const [contact, setContact] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  // for fetching the details when the page load
  useEffect(() => {
    // function for calling the list
    const fetchListing = async () => {
      try {
        setLoading(true);
        // api call for the listings
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        if (data.message === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchListing();
  }, [params.listingId]);
  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl uppercase">.... loading</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl">something went wrong !</p>
      )}
      {listing && !loading && !error && (
        <>
          <ListingCarousel listingProp={listing} />
        </>
      )}
      {/* share icon image added */}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {/* text for copying after the link  */}
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing?.name} - ${' '}
              {listing?.offer
                ? listing?.discountPrice.toLocaleString('en-US')
                : listing?.regularPrice.toLocaleString('en-US')}
              {listing?.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing?.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing?.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing?.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  $ {+listing?.regularPrice - +listing?.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing?.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing?.bedRooms > 1
                  ? `${listing?.bedRooms} beds `
                  : `${listing?.bedRooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing?.bathRooms > 1
                  ? `${listing?.bathRooms} baths `
                  : `${listing?.bathRooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing?.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing?.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {currentUser && listing?.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>

    </main>
  );
};

export default Listing;
