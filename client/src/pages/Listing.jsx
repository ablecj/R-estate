import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ListingCarousel from '../components/ListingCarousel';

const Listing = () => {
    const params = useParams()
    // state for storing the fetched list data
    const [listing, setListing] = useState(null);
    // stae for handling the loading 
    const [loading, setLoading] = useState(true);
    // state for handling Error 
    const [error, setError] = useState(false);

    // for fetching the details when the page load
    useEffect(()=> {
        // function for calling the list 
        const fetchListing = async () => {
            try {
                setLoading(true)
                // api call for the listings
                const res = await fetch(`/api/listing//getListing/${params.listingId}`);
                const data = await res.json();
                if(data.message === false){
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
        }
        fetchListing();
    }, [params.listingId])
  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl uppercase'> 
        .... loading</p>
      }
      {
        error && <p className='text-center my-7 text-2xl' >something went wrong !</p>
      }
      {
        listing && !loading && !error && (
          <>
            <ListingCarousel listingProp={listing} />
          </>

        )
      }
    </main>
  )
}

export default Listing
