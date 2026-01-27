import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

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
import Register from "./Pages/Register/Register";
import { useLocation } from "react-router-dom";
import GoTrip from "./Pages/vendor/VendorCategory/GoTrip";
import Stays from "./Pages/vendor/VendorCategory/Stays";
import Vehicle from "./Pages/vendor/VendorCategory/Vehicle";
import VendorDashboard from "./Pages/vendor/VendorDashboard";
import GoTripDashboard from "./Pages/vendor/GoTripDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const App = () => {
  const location = useLocation().pathname.includes("/vendor");
  return (
    <div className="bg-black">
      {!location && <Navbar />}

      <Scroll />
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/villa/:category?" element={<Villa />} />

        <Route path="/trending/:name" element={<Trending />} />
        <Route path="/trending/:name/gallery" element={<TrendingGallery />} />
        <Route path="/places/:district?" element={<Visitingplaces />} />
        <Route path="/safarihome" element={<Safarihome />} />
        <Route path="/safaridetails/:id" element={<SafariDetails />} />
        <Route path="/vehicle" element={<VehicleCard />} />
        <Route path="/vendor/register" element={<Register />} />

        <Route path="/vendor/dashboard-stays" element={<VendorDashboard />} />
        <Route path="/vendor/dashboard-gotrip" element={<GoTripDashboard />} />
        <Route
          path="/vendor/dashboard-ontrip"
          element={
            <ProtectedRoute allowedRole="vendor" allowedCategory="ontrip">
              <GoTrip />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/dashboard-vehicles"
          element={
            <ProtectedRoute allowedRole="vendor" allowedCategory="vehicle_rent">
              <Vehicle />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!location && <Footer />}

      {/* Toasts (global) */}
      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;
