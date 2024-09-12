import axios from 'axios';

export const localAxios = () => {
  const instance = axios.create({
    baseURL: '',
    withCredentials: true,
  });

  instance.defaults.headers.common['Authorization'] = '';
  instance.defaults.headers.post['Content-Type'] = 'application/json';
  instance.defaults.headers.patch['Content-Type'] = 'application/json';
  instance.defaults.headers.put['Content-Type'] = 'application/json';
  return instance;
};
