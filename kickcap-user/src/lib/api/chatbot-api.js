import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

export const sendMessage = async (input) => {
  try {
    const response = await axiosInstance.post('', { message: input });
    return response.data;
  } catch (err) {
    console.error(`메시지 송신 중 오류 발생: ${err}`);
  }
};
