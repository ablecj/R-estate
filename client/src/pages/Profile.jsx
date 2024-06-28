import React from 'react'
import { useSelector } from 'react-redux';

export default function Profile() {
// using the useSelector hook for acessing the previous data 
const {currentUser} = useSelector((state) => state.user);

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Profile</h1>

      <form className='flex flex-col gap-4' >
        <img src={currentUser.avatar} alt="profile-pic"
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />

        <input type="text" placeholder='username'
         className='border p-3 rounded-lg' id='username' />

        <input type="email" placeholder='email'
         className='border p-3 rounded-lg' id='email' />

        <input type="password" placeholder='password'
         className='border p-3 rounded-lg' id='password' />

        <button className='bg-slate-700 text-white p-3 
         rounded-lg uppercase hover:opacity-90 disabled:opacity-70'>Update</button>
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
