import { localAxios } from "../../util/axios-setting";

const axiosInstance = localAxios();

export const getObjectionList = async (status) => {
  try {
    const response = await axiosInstance.get('/objections/user', {
      params: {
        status: status,
        role: 'user',
      }
    });

    console.log(`response.status: ${response.status}`);

    if (response.status === 200) {
      return response.data
    } else {
      return [];
    }
  } catch (err) {
    console.log(`이의제기 목록 조회 GET 요청 실패: ${err}`);
    return [];
  }
};