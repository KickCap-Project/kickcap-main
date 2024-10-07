import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isBannerOpen: false,
  bannerType: '',
};

const carouselModalSlice = createSlice({
  name: 'carouselModal',
  initialState,
  reducers: {
    ChangeIsBanner(state, action) {
      state.isBannerOpen = action.payload;
    },
    setBannerType(state, action) {
      state.bannerType = action.payload;
    },
  },
});

export const { ChangeIsBanner, setBannerType } = carouselModalSlice.actions;
export default carouselModalSlice.reducer;

export const selectIsBanner = (state) => state.carouselModal.isBannerOpen;
export const selectBannerType = (state) => state.carouselModal.bannerType;
