export const getAccessToken = () => {
  return localStorage.getItem('accessToken'); // 혹은 쿠키 등
};

export const setAccessToken = (token) => {
  localStorage.setItem('accessToken', token); // 혹은 쿠키 등
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken'); // 혹은 쿠키 등
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
