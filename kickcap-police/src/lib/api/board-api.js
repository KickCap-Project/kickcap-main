import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const getWeekDataAll = async (success, fail) => {
  // 1주일 전국
  await local.get(`/dashboard`).then(success).catch(fail);
};

export const getWeekDataDetail = async (sido, gugun, success, fail) => {
  // 1주일 시도, 구군
  await local.get(`/dashboard/regions?sido=${sido}&gugun=${gugun}`).then(success).catch(fail);
};

export const getDataAll = async (violationType, pageNo, success, fail) => {
  // 아래 데이터 전국
  await local.get(`/reports/end?violationType=${violationType}&pageNo=${pageNo}`).then(success).catch(fail);
};

export const getDataSido = async (success, fail) => {
  // 아래 데이터 시도
  await local.get(`/parking-data`).then(success).catch(fail);
};
export const getDataGugun = async (success, fail) => {
  // 아래 데이터 구군
  await local.get(`/parking-data`).then(success).catch(fail);
};

export const getMarkerData = async (success, fail) => {
  // 지도 마커 데이터
  await local.get(`/dashboard/police/stations`).then(success).catch(fail);
};

export const getCCTVInfo = async (success, fail) => {
  // cctv 상세
  await local.get(`/parking-data`).then(success).catch(fail);
};
