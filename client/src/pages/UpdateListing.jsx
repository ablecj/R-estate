import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';

const UpdateListing = () => {

    // useNavigate for navigating to the next page 
    const navigate = useNavigate()
    // taking the id form the request using useParams
    const params = useParams();
  
    // useSelector from the react redux
    const {currentUser} = useSelector(state => state.user)
    // set te file value inside a state
    const [files, setFiles] = useState([]);
    // creating the formdata for the create listing
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: '',
      description: '',
      address: '',
      type: 'rent',
      bedRooms: 1,
      bathRooms: 1,
      regularPrice: 15000,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
  
    });

    console.log(formData, "fromdaata updatelisting !")
  
    // state for error handling
    const [imageUploadError, setImageUploadError] = useState(false);
  
    // state for uploading and upload state managing 
    const [uploading, setUploading] = useState(false);
    // error state for tracking the error occured when the form is submited
    const [error, setError] = useState(false);
    // state for loading 
    const [loading, setLoading] = useState(false);

    // useEffect to load the listing data when the page loads
    useEffect(()=> {
      // function for asyncrounous data fetcheing 
      const fetchingList = async () => {
        const listingId = params.listingId;
        // request to fetch the data from the database 
        const res = await fetch(`/api/listing/getListing/${listingId}`);
        const data = await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }
        setFormData(data);
      } 

      fetchingList();
     }, [])
    
    // function definition for handleImageSubmit
    const handleImageSubmit = (e) => {
      // cheking the files are there or not
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
  
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImages(files[i]));
        }
  
        // scheduling the each promises corectly
        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((err) => {
            setImageUploadError("image upload failed max 2(mb) per file !");
            setUploading(false);
          });
      } else {
        setImageUploadError("You can only upload 6 images per listing !");
        setUploading(false);
      }
    };
  
    // function for store image
    const storeImages = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(progress, "file upload for listing");
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
  
    // function for deleting the selected image 
    const handleRemoveImage = (index)=> {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i)=> (i != index)
      )
        
      })
    }
  
    // handle change function for tracking the values inside the form 
    const handleChange = (e)=> {
      // setting the value of rent and sale inside the formdata using setFormData
      if(e.target.id === 'sale' || e.target.id == 'rent'){
        setFormData({
          ...formData,
          type: e.target.id
        })
      }
      // setting the parking and other values inside the formData
      if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
       setFormData({
        ...formData,
        [e.target.id] : e.target.checked 
       })
      }
      // tracking the other values in the form 
      if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        })
      }
    }
  
    // function for submiting the form data
    const handleFormSubmit = async(e)=> {
      e.preventDefault();
      try {
        // validation for image is empty or not
        if(formData.imageUrls.length < 1) {
          return setError('please upload atleast 1 image');
        }
        // validation for regularprice is less than discountprice
        if(+formData.regularPrice < +formData.discountPrice){
          return setError('Discount price must be lower than regular price');
        }
  
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.listingId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });
  
        const data = await res.json();
        setLoading(false);
        if(data.success === false) {
          setError(data.message);
        }
        // navigate to the listing page if the data is sucess
        navigate(`/listing/${data._id}`);
        
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }   
    }


  return (
    <main className="p-3 mx-auto max-w-4xl">
    <h1 className="text-3xl font-semibold text-center my-7">
      Update Listing
    </h1>

    <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-4 flex-1">
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="name"
          maxLength="62"
          minLength="8"
          required
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
        />
        <textarea
          type="text"
          className="border p-3 rounded-lg"
          id="description"
          required
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          id="address"
          maxLength="62"
          minLength="8"
          required
          placeholder="Address"
          onChange={handleChange}
          value={formData.address}
        />
        <div className="flex gap-6 flex-wrap">
          <div className="flex gap-2">
            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === 'sale'} />
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === 'rent'}  />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} value={formData.parking} />
            <span>Parking spot</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} value={formData.furnished} />
            <span>Furnished</span>
          </div>
          <div className="flex gap-2">
            <input type="checkbox" id="offer" className="w-5" onChange={handleChange} value={formData.offer} />
            <span>Offer</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              id="bedRooms"
              min="1"
              max="10"
              required
              className="border-gray-300 border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.bedRooms}
            />
            <p>Bed</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              id="bathRooms"
              min="1"
              max="10"
              required
              className="border-gray-300 border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.bathRooms}
            />
            <p>Baths</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              id="regularPrice"
              min="15000"
              max="100000000"
              required
              className="border-gray-300 border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className="flex flex-col items-center">
              <p>Regula Price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>
          {formData.offer && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              id="discountPrice"
              min="0"
              max="100000000"
              required
              className="border-gray-300 border p-3 rounded-lg"
              onChange={handleChange}
              value={formData.discountPrice}
            />
            <div className="flex flex-col items-center">
              <p>Discount Price</p>
              <span className="text-xs">($ / month)</span>
            </div>
          </div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">
          Images:{" "}
          <span className="font-normal text-gray-600 ml-2">
            The first Image will be the cover(max 6)
          </span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            id="images"
            accept="/*"
            multiple
            className="p-3 border border-gray-300 rounded w-full"
          />
          <button
            type="button"
            disabled= {uploading}
            onClick={handleImageSubmit}
            className="p-3 text-green-700 border border-green-700 
          rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "uploading..." : "upload"}
          </button>
        </div>
        <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
        {
          formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=> (
            <div key={url} className="flex justify-between rounded-lg p-3 items-center border">
              <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg " />
              <button type="button" onClick={()=> handleRemoveImage(index)} className="text-red-700 uppercase rounded-lg hover:opacity-65">Delete</button>
            </div>
          ))
        }
        <button
        disabled={loading || uploading}
          className="p-3 bg-slate-700 text-white 
          rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
        >
          {loading ? 'creating..' : 'update listing'}
        </button>
        {/* error message showing */}
        {error && <p className="text-red-700 text-sm">{error}</p>}
      </div>
    </form>
  </main>
  )
}

export default UpdateListing
