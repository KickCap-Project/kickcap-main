import axios from 'axios';
import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

export const getBillList = async (pageNo) => {
  try {
    const response = await axiosInstance.get('/bills', {
      params: { pageNo },
    });

    return response.data;
  } catch (err) {
    alert('고지서 목록을 받아오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return [];
  }
};

export const getBillDetail = async (billId) => {
  try {
    const response = await axiosInstance.get(`/bills/${billId}`);

    return response.data;
  } catch {
    alert('고지서 상세 정보를 받아오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const getImgFile = async (imageSrc) => {
  try {
    const response = await axios.get(imageSrc, { responseType: 'blob' });

    return response.data; 
  } catch (err) {
    alert('이미지를 불러오는 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const submitObjection = async (billId, title, content) => {
  try {
    const response = await axiosInstance.post(`/bills/${billId}/objections`, {
      title,
      content,
    });

    return response;
  } catch (err) {
    if (err.response && err.response.status === 405) {
      // 이미 이의제기를 한 경우(405 Error) 사용자에게 알림
      alert('이미 이의제기를 신청하셨습니다. 단속내역 당 1건만 가능합니다.');
    } else {
      alert('이의제기 신청이 실패하셨습니다. 잠시 후 다시 시도해주세요.');
    }
    throw err;
  }
};

export const postBillPay = async (billId, isEdu, success, fail) => {
  // 납부하기
  await axiosInstance.post(`/bills/${billId}/pay`, { isEdu }).then(success).catch(fail);
};
