import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const gettest = async (sido, gugun, success, fail) => {
  // 1주일 데이터
  await local.get(`/dashboard/`, { params: { sido, gugun } }).then(success).catch(fail);
};

export const getWeekData = async (sido, gugun, success, fail) => {
  // 1주일 데이터
  await local.get(`/dashboard/weeks`, { params: { sido, gugun } }).then(success).catch(fail);
};

export const getBottomData = async (sido, gugun, success, fail) => {
  // 바텀 통계 데이터
  await local.get(`/dashboard/bottoms`, { params: { sido, gugun } }).then(success).catch(fail);
};

export const getMarkerData = async (sido, gugun, success, fail) => {
  // 지도 마커 데이터
  await local.get(`/dashboard/markers`, { params: { sido, gugun } }).then(success).catch(fail);
};

export const getCCTVInfo = async (success, fail) => {
  // cctv 상세
  await local.get(``).then(success).catch(fail);
};
