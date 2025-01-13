import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  // state for landloard
  const [landloard, setLandloard] = useState(null);
  // state for message saving
  const [message, setMessage] = useState('');
  console.log(message)

  // useEffect for loading when the page loads
  useEffect(() => {
    const fetchLandloard = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandloard(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLandloard();
  }, [listing.userRef]);

  // function for tracking the text inside the textarea
  const handleMessageChange = (e)=> {
    setMessage(e.target.value)
  }

  return (
    <>
      {landloard && (
        <div className="flex flex-col gap-4">
          <p>
            contact <span className="font-semibold">{landloard.username}</span>{" "}
            for{" "}
            <span className="font-semibold"> {listing.name.toLowerCase()}</span>{" "}
          </p>
          <textarea name="message" id="message" 
          rows='2'value={message} 
          onChange={handleMessageChange}
          placeholder="Enter your message here !"
          className="w-full border p-3 rounded-lg outline-none"
          ></textarea>

          <Link to={`mailto:${landloard.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 uppercase text-center text-white p-3 rounded-lg hover:opacity-75"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
