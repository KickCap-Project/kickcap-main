import axios from 'axios';
import { getRefreshToken, removeTokens, setAccessToken } from './tokenService';

export const localAxios = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = sessionStorage.getItem('refreshToken');
      const fcmToken = sessionStorage.getItem('fcmToken');

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      if (refreshToken) {
        config.headers['RefreshToken'] = refreshToken;
      }
      if (fcmToken) {
        config.headers['fcmToekn'] = fcmToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // 401 에러 (액세스 토큰 만료 등)
      if (error.response && error.response.status === 500) {
        const refresh = getRefreshToken(); // 스토리지에서 리프레시 토큰 가져오기

        if (refresh) {
          try {
            const toeknRefreshResult = await instance.post(`/token/refresh`, refresh);
            const { accessToken } = toeknRefreshResult.data;

            // 새로운 액세스 토큰을 스토리지에 저장
            setAccessToken(accessToken);

            // 실패한 요청을 새 액세스 토큰과 함께 재전송
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰이 만료되었거나 오류가 발생한 경우 로그아웃 처리
            removeTokens(); // 토큰 제거
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            return Promise.reject(refreshError);
          }
        } else {
          // 리프레시 토큰이 없으면 로그아웃 처리
          removeTokens();
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );

  // instance.defaults.headers.common['Authorization'] = '';
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  instance.defaults.headers.patch['Content-Type'] = 'application/json';
  // instance.defaults.headers.put['Content-Type'] = 'application/json';
  return instance;
};
