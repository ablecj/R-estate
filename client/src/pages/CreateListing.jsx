import React from "react";

export default function createListing() {
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
            <input type="file" id="images"
            accept="/*" multiple
            className="p-3 border border-gray-300 rounded w-full" />
            <button className="p-3 text-green-700 border border-green-700 
            rounded uppercase hover:shadow-lg disabled:opacity-80">Upload</button>
          </div>
            <button className="p-3 bg-slate-700 text-white 
            rounded-lg uppercase hover:opacity-90 disabled:opacity-75">
                Create Listing
            </button>
        </div>
      </form>
    </main>
  );
}
