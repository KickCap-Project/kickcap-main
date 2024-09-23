export const getAccessToken = () => {
  return sessionStorage.getItem('accessToken'); // 혹은 쿠키 등
};

export const setAccessToken = (token) => {
  sessionStorage.setItem('accessToken', token); // 혹은 쿠키 등
};

export const getRefreshToken = () => {
  return sessionStorage.getItem('refreshToken'); // 혹은 쿠키 등
};

export const removeTokens = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
};
