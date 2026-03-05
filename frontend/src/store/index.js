import { configureStore } from "@reduxjs/toolkit";
import vehicleReducer from "./vehicleSlice";

export const store = configureStore({
  reducer: {
    vehicles: vehicleReducer,
  },
});
