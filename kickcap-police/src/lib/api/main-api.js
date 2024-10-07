import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const policeLogin = async (param, success, fail) => {
  // 로그인
  await local.post(`/police/login`, param).then(success).catch(fail);
};

export const logout = async (fcmToken, success, fail) => {
  // 로그아웃
  await local.post(`/police/logout`, fcmToken).then(success).catch(fail);
};

export const getRefresh = async (refreshToken, success, fail) => {
  //토큰 재발급
  await local.post(`/token/refresh`, refreshToken).then(success).catch(fail);
};

export const getEmergency = async () => {
  // 긴급 신고 조회
  const response = await local.get(`/reports/accident`);
  return response.data; // 응답의 데이터를 반환
};

export const getMove = async (idx, success, fail) => {
  //출동
  await local.post(`/reports/accident/${idx}`).then(success).catch(fail);
};
