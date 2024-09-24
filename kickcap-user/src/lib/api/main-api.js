import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const socialLogin = async (param, success, fail) => {
  // 소셜로그인
  await local.post(``, param).then(success).catch(fail);
};

export const logout = async (fcmToken, success, fail) => {
  // 로그아웃
  await local.post(`/members/logout`, fcmToken).then(success).catch(fail);
};
