import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nav: 'board',
};

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    change: (state, action) => {
      state.nav = action.payload;
    },
  },
});

export const navActions = navSlice.actions;
export const selectNav = (state) => state.nav.nav;
export default navSlice.reducer;
