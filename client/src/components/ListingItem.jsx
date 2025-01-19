import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({listing}) => {
  return (
    <div className='bg-white shadow hover:shadow-lg 
    transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] '>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls[0]} alt="listing_cover"
        className='h-[320px] sm:h-[220px] w-full object-cover
         hover:scale-105 transition-scale duration-300' />

         <div className="p-3 flex flex-col gap-2 w-full mt-2">
            <p className='text-lg font-semibold text-slate-700
             truncate'>{listing.name}
            </p>
            <div className="flex items-center gap-1">
                <MdLocationOn className='h-4 w-4 text-red-600' />
                <p className='text-sm text-gray-600 truncate w-full'>{listing.address}</p>
            </div>
              <p className='line-clamp-2  text-sm text-gray-600 '>
                {listing.description}
              </p>
              <p className='text-slate-500 mt-2 font-semibold
                flex items-center'>
                $ {' '}
                {listing.offer ? listing.discountPrice.toLocaleString('en-US') 
                : listing.regularPrice.toLocaleString('en-US')
                }
                {listing.type === 'rent' && ' / month'}
              </p>
              <div className="text-slate-700 flex gap-2">
                <div className="font-bold text-xs">
                  {listing.bedRooms === 1 ? `${listing.bedRooms} bed`
                  : `${listing.bedRooms} beds`}
                </div>
                <div className="font-bold text-xs">
                  {listing.bathRooms === 1 ? `${listing.bathRooms} bath`
                  : `${listing.bathRooms} baths`}
                </div>
              </div>
          </div>
      </Link>
    </div>
  )
}

export default ListingItem
