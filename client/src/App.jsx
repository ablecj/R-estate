import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import About from './pages/About';
import Header from './components/Header';
import CreateListing from './pages/CreateListing'
import PrivateRoute from './components/PrivateRoute';



const App = () => {
  return (
   <BrowserRouter>
   <Header />
    <Routes>
      <Route path='/' element={<Home />} />

      <Route path='/sign-in' element={<SignIn />} />

      <Route path='/sign-up' element={<SignUp />} />

      <Route element={<PrivateRoute />}>
      <Route path='/profile' element={<Profile />} />
      <Route path='/create-listing' element={<CreateListing />} />
      </Route>

       <Route path='/about' element={<About />} />
    </Routes>
   </BrowserRouter>
  )
}

export default App
