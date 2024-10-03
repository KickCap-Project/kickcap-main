import axios from 'axios';
import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

export const getBillList = async (pageNo) => {
  try {
    const response = await axiosInstance.get('/bills', {
      params: { pageNo },
    });

    console.log(`response.status: ${response.status}`);

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

export const getBillDetail = async (billId) => {
  try {
    const response = await axiosInstance.get(`/bills/${billId}`);

    console.log(`response.status: ${response.status}`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.log('고지서 상세 정보를 받아오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      alert('고지서 상세 정보를 받아오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
  } catch {
    console.log('고지서 상세 정보를 받아오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    alert('고지서 상세 정보를 받아오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    return;
  }
};

export const getImgFile = async (imageSrc) => {
  try {
    const response = await axios.get(imageSrc, { responseType: 'blob' });

    if (response.status === 200) {
      console.log('이미지 파일을 불러오는 데 성공했습니다.');
      return response.data;
    } else {
      console.log(`이미지를 불러오는 데 실패했습니다: ${response.status}`);
      return null;
    }
  } catch (err) {
    console.log(`이미지를 불러오는 중 에러가 발생했습니다: ${err}`);
    return null;
  }
};

export const submitObjection = async (billId, title, content) => {
  try {
    const response = await axiosInstance.post(`/bills/${billId}/objections`, {
      title,
      content,
    });

    if (response.status === 200 || response.status === 201) {
      console.log('이의제기 POST 요청 성공');
    }
    return response;
  } catch (err) {
    if (err.response && err.response.status === 405) {
      // 이미 이의제기를 한 경우(405 Error) 사용자에게 알림
      alert('이미 이의제기를 제출하셨습니다. 단속내역 당 1건만 가능합니다.');
    } else {
      console.log(`이의제기 POST 요청 실패: ${err}`);
    }
    throw err;
  }
};

export const postBillPay = async (billId, isEdu, success, fail) => {
  // 납부하기
  await axiosInstance.post(`/bills/${billId}/pay`, isEdu).then(success).catch(fail);
};
