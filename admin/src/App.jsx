import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddProduct from "./Pages/Product/AddProduct";
// Components
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// Pages
import ShowProductAcount from "./Pages/Product/ShowProductAcount";
import ShowProduct from "./Pages/Product/ShowProduct";
import EditProduct from "./Pages/Product/EditProduct";
import AddTrending from "./Pages/Add/AddTrending";
import AddStays from "./Pages/Add/AddStays";
import DeleteTrending from "./Pages/Delete/DeleteTrending";
import RemoveStays from "./Pages/Delete/RemoveStays";
import EditTrending from "./Pages/edit/Edit";
import AddTraveling from "./Pages/Add/AddTraveling";
import DeletePlaces from "./Pages/Delete/DletePlaces";
import AddSafari from "./Pages/Add/AddSafari";
import DleteSafari from "./Pages/Delete/DleteSafari";
import EditSafariPage from "./Pages/edit/EditSafariPage";
import Home from "./Pages/Home/Home";
import SafariPaid from "./Pages/Paid/SafariPaid";
import TrendingPaid from "./Pages/Paid/Trendingpaid";
import Ads from "./Pages/ADS/Ads";
import AdsUpdate from "./Pages/ADS/AdsUpdate";
import AdsManage from "./Pages/ADS/AdsManage";
import VendorManage from "./Pages/Vendor/VendorManage";
import VendorDashboard from "./Pages/Vendor/VendorDashboard";
import AddVendor from "./Pages/Vendor/AddVendor";
import RegisterVendor from "./Pages/Vendor/RegisterVendor";
import StaysDashboard from "./Pages/Home/StaysDashboard";
import ShowStays from "./Pages/Show/ShowStays";
import ShowSafari from "./Pages/Show/ShowSafari";
import NewStays from "./Pages/NewVendors/NewStays";
import DeleteProduct from "./Pages/Product/DeleteProduct";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Protect private routes
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Conditional Rendering */}
      {!token ? (
        <Login settoken={setToken} />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <Navbar settoken={setToken} />

          <div className="flex">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">
              <div className="bg-white rounded-xl shadow-sm min-h-[calc(100vh-120px)] p-6">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Home token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <Home token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addtrending"
                    element={
                      <ProtectedRoute>
                        <AddTrending token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addstays"
                    element={
                      <ProtectedRoute>
                        <AddStays token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/deletetrending"
                    element={
                      <ProtectedRoute>
                        <DeleteTrending token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/removestays"
                    element={
                      <ProtectedRoute>
                        <RemoveStays token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edittrending"
                    element={
                      <ProtectedRoute>
                        <EditTrending token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addtravellingplaces"
                    element={
                      <ProtectedRoute>
                        <AddTraveling token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/deletetravellingplaces"
                    element={
                      <ProtectedRoute>
                        <DeletePlaces token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addsafari"
                    element={
                      <ProtectedRoute>
                        <AddSafari token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/deletesafari"
                    element={
                      <ProtectedRoute>
                        <DleteSafari token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/editsafari"
                    element={
                      <ProtectedRoute>
                        <EditSafariPage token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/safari/edit/:id"
                    element={
                      <ProtectedRoute>
                        <EditSafariPage token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/staypaid"
                    element={
                      <ProtectedRoute>
                        <TrendingPaid token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/safaripaid"
                    element={
                      <ProtectedRoute>
                        <SafariPaid token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ads"
                    element={
                      <ProtectedRoute>
                        <AdsManage token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addads"
                    element={
                      <ProtectedRoute>
                        <Ads token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/updateads"
                    element={
                      <ProtectedRoute>
                        <AdsUpdate token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/addvendor"
                    element={
                      <ProtectedRoute>
                        <AddVendor token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/registervendor"
                    element={
                      <ProtectedRoute>
                        <RegisterVendor token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendors"
                    element={
                      <ProtectedRoute>
                        <VendorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/vendors/manage"
                    element={
                      <ProtectedRoute>
                        <VendorManage token={token} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stays"
                    element={
                      <ProtectedRoute>
                        <StaysDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tripdashboard"
                    element={<Navigate to="/stays" replace />}
                  />
                  <Route path="/showstays" element={<ShowStays />} />
                  <Route path="/showsafari" element={<ShowSafari />} />
                  <Route
                    path="/newstays"
                    element={<NewStays token={token} />}
                  />

                   <Route
                    path="/addproduct"
                    element={
                      <ProtectedRoute>
                        <AddProduct token={token} />
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/deleteproduct"
                    element={
                      <ProtectedRoute>
                        <DeleteProduct token={token} />
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/editproduct"
                    element={
                      <ProtectedRoute>
                        <EditProduct token={token} />
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/showproductAccount"
                    element={
                      <ProtectedRoute>
                        <ShowProductAcount token={token} />
                      </ProtectedRoute>
                    }
                  />
                   <Route
                    path="/showproducts"
                    element={
                      <ProtectedRoute>
                        <ShowProduct token={token} />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
