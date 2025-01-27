import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import '../styles/ListingCarousal.css';

const HomeCarousel = ({ offerListings }) => {
  if (!offerListings || offerListings.length === 0) return null;

  return (
    <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {offerListings.map((listings, index) => (
        <SwiperSlide key={listings._id || index}>
          <div
            style={{
              background: `url(${listings.imageUrls[0]}) center no-repeat`,
              backgroundSize: 'cover',   borderRadius: '10px',  
              overflow: 'hidden',
            }}
            className="h-full w-full"
          >
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeCarousel;
