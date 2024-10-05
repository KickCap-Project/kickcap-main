import { localAxios } from '../../util/axios-setting';

const local = localAxios();

// export const gettest = async (success, fail) => {
//   // 1주일 데이터
//   await local.get(`/dashboard/`).then(success).catch(fail);
// };

// export const getWeekData = async (sido, gugun, success, fail) => {
//   // 1주일 데이터
//   await local.get(`/dashboard/weeks`, { params: { sido, gugun } }).then(success).catch(fail);
// };

export const gettest = async () => {
  // 바텀 통계 데이터
  const response = await local.get(`/dashboard/`);
  return response.data; // 응답의 데이터를 반환
};

export const getWeekData = async (sido, gugun) => {
  // 바텀 통계 데이터
  const response = await local.get(`/dashboard/weeks`, { params: { sido, gugun } });
  return response.data; // 응답의 데이터를 반환
};

export const getBottomData = async (sido, gugun) => {
  // 바텀 통계 데이터
  const response = await local.get(`/dashboard/bottoms`, { params: { sido, gugun } });
  return response.data; // 응답의 데이터를 반환
};

export const getMarkerData = async (sido, gugun, success, fail) => {
  // 지도 마커 데이터
  await local.get(`/dashboard/markers`, { params: { sido, gugun } }).then(success).catch(fail);
};

export const getCCTVInfo = async (idx, time, success, fail) => {
  // cctv 상세
  await local.get(`/dashboard/cctv`, { params: { idx, time } }).then(success).catch(fail);
};
