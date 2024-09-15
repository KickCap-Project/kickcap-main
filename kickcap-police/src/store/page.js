import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  crack: 'helmet',
  report: 'park',
  complaint: 'progress',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    changeCrackType: (state, action) => {
      state.crack = action.payload;
    },
    changeReportType: (state, action) => {
      state.report = action.payload;
    },
    changeComplaintType: (state, action) => {
      state.complaint = action.payload;
    },
  },
});

export const pageActions = pageSlice.actions;
export const selectCrackNav = (state) => state.page.crack;
export const selectReportNav = (state) => state.page.report;
export const selectComplaintNav = (state) => state.page.complaint;

export default pageSlice.reducer;
