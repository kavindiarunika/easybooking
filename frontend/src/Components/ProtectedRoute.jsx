import React from "react";
import { Navigate } from "react-router-dom";

// Small helper to safely decode JWT payload without extra dependency
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const ProtectedRoute = ({ children, allowedRole, allowedCategory }) => {
  // support either vendorToken or adminToken if your app uses different keys
  const token =
    localStorage.getItem("vendorToken") || localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/vendor/register" replace />;

  const payload = parseJwt(token);
  if (!payload) return <Navigate to="/vendor/register" replace />;

  if (allowedRole) {
    // Accept explicit role claims OR product-vendor style tokens that include vendorId
    const roleMatches = payload.role === allowedRole;
    const vendorIdClaim =
      allowedRole === "vendor" && (payload.vendorId || payload._id);
    if (!roleMatches && !vendorIdClaim) {
      return <Navigate to="/vendor/register" replace />;
    }
  }

  if (allowedCategory && payload.category !== allowedCategory) {
    // If vendor is logged in but tries to access a different vendor dashboard, redirect them to their own dashboard
    if (payload.role === "vendor" && payload.category) {
      const map = {
        stays: "/vendor/dashboard-stays",
        ontrip: "/vendor/dashboard-ontrip",
        vehicle_rent: "/vendor/dashboard-vehicles",
      };
      const dest = map[payload.category] || "/vendor/register";
      return <Navigate to={dest} replace />;
    }

    return <Navigate to="/vendor/register" replace />;
  }

  return children;
};

export default ProtectedRoute;
