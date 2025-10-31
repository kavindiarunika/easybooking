import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home';
import Navbar from './Components/Navbar'
import Footer from './Components/Footer';
import Gallery from './Pages/Gallery/Gallery';
import Trending from './Pages/Trending/Trending';
import VisitingPlaces from './Pages/CustomizedPackage/VisitingPlaces';
// In your main application file (e.g., src/main.jsx)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Villa from './Pages/villas/Villa';

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const App = () => {
  return (
    <div className='bg-black'>
      <Navbar/>
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/gallery' element={<Gallery/>}/>
        <Route path='/villa' element={<Villa/>}/>
        <Route path='/visitingplaces' element={<VisitingPlaces/>}/>
        <Route path='/trending/:name' element={<Trending/>}/>
      
     
      </Routes>
      
      <Footer/>
    </div>
  )
}

export default App