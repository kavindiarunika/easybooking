import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Gallery from "./Pages/Gallery/Gallery";
import Trending from "./Pages/Trending/Trending";
import TrendingGallery from "./Pages/TrendingGallery/Gallery";
import Visitingplaces from "./Pages/VisitingPlaces/Visitingplaces";
// In your main application file (e.g., src/main.jsx)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Scroll from "./Components/Scroll";
import Villa from "./Pages/villas/Villa";
import Safarihome from "./Pages/safari/Safarihome";
import SafariDetails from "./Pages/safari/SafariDetails";
import VehicleCard from "./Pages/vehicleRent/VehicleCard";

// eslint-disable-next-line react-refresh/only-export-components
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  return (
    <div className="bg-black">
      <Navbar />
<Scroll/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/villa" element={<Villa />} />
      
        <Route path="/trending/:name" element={<Trending />} />
        <Route path="/trending/:name/gallery" element={<TrendingGallery />} />
        <Route path ='/places' element ={<Visitingplaces/>}/>
        <Route path ='/safarihome' element ={<Safarihome/>}/>
        <Route path ='/safaridetails/:id' element ={<SafariDetails/>}/>
        <Route path ='/vehicle' element ={<VehicleCard/>}/>
        
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
