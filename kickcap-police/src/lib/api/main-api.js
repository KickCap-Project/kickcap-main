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
  await local.post(`/token/refresh`, refreshToken).then(success).catch(fail);
};
