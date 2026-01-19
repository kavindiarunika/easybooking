import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Components
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
// Pages
import AddTrending from "./Pages/Add/AddTrending";
import DeleteTrending from "./Pages/Delete/DeleteTrending";
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
        <>
          <Navbar settoken={setToken} />
          <hr className="bg-gray-200" />

          <div className="flex w-full">
            <Sidebar />

            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
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
                  path="/addtrending"
                  element={
                    <ProtectedRoute>
                      <AddTrending token={token} />
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
                  path="/vendors"
                  element={
                    <ProtectedRoute>
                      <VendorManage token={token} />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
