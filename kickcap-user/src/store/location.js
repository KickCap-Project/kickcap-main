import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  latitude: null,
  longitude: null,
  address: '',
  code: '',
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.address = action.payload.address;
      state.code = action.payload.code;
    },
    clearLocation: (state, action) => {
      state.latitude = null;
      state.longitude = null;
      state.address = '';
      state.code = '';
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export const selectLatitude = (state) => state.location.latitude;
export const selectLongitude = (state) => state.location.longitude;
export const selectAddress = (state) => state.location.address;
export const selectCode = (state) => state.location.code;
export default locationSlice.reducer;
