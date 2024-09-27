import axios from 'axios';
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

export const getBillDetail = async (billId) => {
  const dummy = {
    idx: billId,
    kickboardNumber: 'G2468',
    date: '2024-09-27T11:03:00Z',
    address: '대전 유성구 학하대로',
    violationType: '안전모 미착용',
    demerit: 3,
    fine: 20000,
    totalBill: 30000,
    deadLine: '2024-09-30T14:59:59Z',
    police: '대전 유성 경찰서',
    isFlag: 'UNPAID',
    isObjection: 0,
    imgSrc: '',
  };

  try {
    const response = await axiosInstance.get(`/bills/${billId}`);

    console.log(`response.status: ${response.status}`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.log('고지서 상세 정보를 받아오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return dummy;
      // alert('고지서 상세 정보를 받아오는 데 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      // navigate
    }
  } catch {
    console.log('고지서 상세 정보를 받아오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    return dummy;
    // alert('고지서 상세 정보를 받아오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const getImgFile = async (imgSrc) => {
  try {
    const response = await axios.get(imgSrc);

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`이미지를 불러오는 데 실패했습니다: ${response.status}`);
      return;
    }
  } catch (err) {
    console.log(`error: ${err}`);
    return;
  }
};
