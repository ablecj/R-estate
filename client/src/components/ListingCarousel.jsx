import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import '../styles/ListingCarousal.css';

// Import required modules
import { Navigation } from 'swiper/modules';

const ListingCarousel = ({ listingProp }) => {
    console.log(listingProp)
  return (
    <div>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        {listingProp.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                backgroundImage: `url(${url})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover', 
                backgroundRepeat: 'no-repeat',
                height: '550px', 
                width: '100%',  
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ListingCarousel;
