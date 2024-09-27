import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

export const getBillList = async (pageNo) => {
  try {
    const response = await axiosInstance.get('/bills', {
      params: { pageNo },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      alert('데이터를 받아오는 중 오류가 발생했습니다.');
      return [];
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};
