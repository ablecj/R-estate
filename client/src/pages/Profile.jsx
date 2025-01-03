import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../Redux/User/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  // using the useSelector hook for acessing the previous data
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // make the refrence using useRef
  const fileRef = useRef(null);
  // state for file.
  const [file, setFile] = useState(undefined);
  // state for showing the file uploading percentage
  const [filePerc, setFilePerc] = useState(0);
  console.log(filePerc, "filePerc");
  // state for error
  const [fileUploadError, setFileUploadError] = useState(false);
  // state for success message
  const [updateSucess, setUpdateSucess] = useState(false);
  // state for show listing error
  const [showListingError, setShowListingError] = useState(false);
  // state for saving the listing from the backend.
  const [userListings, setUserListings] = useState([]);
  // state for the formData
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  // check for the file and using the useEffect
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  // handlefile uplaod function
  const handleFileUpload = (file) => {
    const storage = getStorage(app);

    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  // function for handlechange in the inputfield
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // functionality for submitting the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSucess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  // functionality for deleting the user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data, "data ffrom profile");
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  // signout functionality
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };
  // handle show listing function to show the uploaded form data
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      // seting the response from the backend inside a state
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  // handleDeleteListingfor deleting the liting from the database
  const handleDeleteListing = async (lisitngId) => {
    try {
      const res = await fetch(`/api/listing/delete/${lisitngId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.success === false) {
        console.log(data.message);
        return;
      }
      // setting the new array of filtered items which is not the id of the deleted listing
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== lisitngId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile-pic"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700 ">
              Error in Image Upload (Image must be less than 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 ">{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700 ">
              Image Successfully Uplaoded!
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          autoComplete="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          autoComplete="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          autoComplete="current-password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 
         rounded-lg uppercase hover:opacity-90 disabled:opacity-70"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 text-center uppercase hover:opacity-80 hover:rounded-lg"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 flex justify-center">
        {error ? error : ""}
      </p>
      <p className="text-green-700 mt-5 flex justify-center">
        {updateSucess ? "User Updated Successfully !" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full">
        Show Listing
      </button>
      <p className="text-red-700 mt-5">
        {showListingError ? "Error ins show listing !" : ""}
      </p>

      {/* consditonaly render the user listing inside the profile  */}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="uppercase text-center mt-7 text-2xl font-semibold">
            Your Listing
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="lisitng cover"
                  className="w-16 h-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-slate-700 font-semibold flex-1 hover:underline truncate "
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  className="uppercase text-red-700"
                  onClick={() => handleDeleteListing(listing._id)}
                >
                  delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="uppercase text-green-700"> edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
