import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function createListing() {
  // set te file value inside a state
  const [files, setFiles] = useState([]);
  // creating the formdata for the create listing
  const [fromData, setFormData] = useState({
    imageUrls: [],
  });
  // state for error handling
  const [imageUploadError, setImageUploadError] = useState(false);
  // state for uploading and upload state managing 
  const [uploading, setUploading] = useState(false);

  console.log(fromData);

  // function definition for handleImageSubmit
  const handleImageSubmit = (e) => {
    // cheking the files are there or not
    if (files.length > 0 && files.length + fromData.imageUrls.length < 7) {
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
            ...fromData,
            imageUrls: fromData.imageUrls.concat(urls),
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
      ...fromData,
      imageUrls: fromData.imageUrls.filter((_, i)=> (i != index)
    )
      
    })
  }

  return (
    <main className="p-3 mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>

      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="8"
            required
            placeholder="Name"
          />
          <textarea
            type="text"
            className="border p-3 rounded-lg"
            id="description"
            required
            placeholder="Description"
          />
          <input
            type="text"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="8"
            required
            placeholder="Address"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
                className="border-gray-300 border p-3 rounded-lg"
              />
              <p>Bed</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border-gray-300 border p-3 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularprice"
                min="1"
                max="10"
                required
                className="border-gray-300 border p-3 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regula Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="discountprice"
                min="1"
                max="10"
                required
                className="border-gray-300 border p-3 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
            fromData.imageUrls.length > 0 && fromData.imageUrls.map((url, index)=> (
              <div key={url} className="flex justify-between rounded-lg p-3 items-center border">
                <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg " />
                <button type="button" onClick={()=> handleRemoveImage(index)} className="text-red-700 uppercase rounded-lg hover:opacity-65">Delete</button>
              </div>
            ))
          }
          <button
            className="p-3 bg-slate-700 text-white 
            rounded-lg uppercase hover:opacity-90 disabled:opacity-75"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
