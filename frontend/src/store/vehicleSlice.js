import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api";

// Thunk for loading all vehicles from backend
export const fetchVehicles = createAsyncThunk("vehicles/fetchAll", async () => {
  const response = await axios.get("/api/vehicle/all");
  return response.data;
});

const vehicleSlice = createSlice({
  name: "vehicles",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // additional synchronous reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.debug("fetchVehicles.fulfilled payload", action.payload);
        state.items = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default vehicleSlice.reducer;

// selectors
export const selectAllVehicles = (state) => state.vehicles.items;
export const selectVehiclesStatus = (state) => state.vehicles.status;
export const selectVehiclesError = (state) => state.vehicles.error;
