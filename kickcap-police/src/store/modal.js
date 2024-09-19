import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCamera: false,
  isEmergency: false,
  isComplaintInfo: false,
  isComplaintSend: false,
  isReportInfo: false,
  isReportPark: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    ChangeIsCamera: (state, action) => {
      state.isCamera = action.payload;
    },
    ChangeIsEmergency: (state, action) => {
      state.isEmergency = action.payload;
    },
    ChangeIsComplaintInfo: (state, action) => {
      state.isComplaintInfo = action.payload;
    },
    ChangeIsComplaintSend: (state, action) => {
      state.isComplaintSend = action.payload;
    },
    ChangeIsReportInfo: (state, action) => {
      state.isReportInfo = action.payload;
    },
    ChangeIsReportPark: (state, action) => {
      state.isReportPark = action.payload;
    },
  },
});

export const modalActions = modalSlice.actions;
export const selectIsCamera = (state) => state.modal.isCamera;
export const selectIsEmergency = (state) => state.modal.isEmergency;
export const selectIsComplaintInfo = (state) => state.modal.isComplaintInfo;
export const selectIsComplaintSend = (state) => state.modal.isComplaintSend;
export const selectIsReportInfo = (state) => state.modal.isReportInfo;
export const selectIsReportPark = (state) => state.modal.isReportPark;
export default modalSlice.reducer;
