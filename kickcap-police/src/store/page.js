import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  crack: 'helmet',
  report: 'helmet',
  complaint: 'progress',
  board: 'park',
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
    changeboardType: (state, action) => {
      state.board = action.payload;
    },
  },
});

export const pageActions = pageSlice.actions;
export const selectCrackNav = (state) => state.page.crack;
export const selectReportNav = (state) => state.page.report;
export const selectComplaintNav = (state) => state.page.complaint;
export const selectBoardNav = (state) => state.page.board;

export default pageSlice.reducer;
