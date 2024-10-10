import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

// 알림 목록 조회
export const getNotificationList = async () => {
  try {
    const response = await axiosInstance.get('/notifications');

    return response.status === 200 ? response.data : [];
  } catch (err) {
    alert('알림 내역을 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return [];
  }
};

// 알림 읽음 처리
export const setIsReadNote = async (nid) => {
  try {
    const response = await axiosInstance.post('/notifications/read', null, {
      params: {
        nid,
      },
    });

    return response.status === 200 || response.status === 201 || response.status === 204;
  } catch (err) {
    // console.log(`알림 상태 변경 중 오류: ${err}`);
    return false;
  }
};

// 메인 페이지에서 알림 확인
export const checkNotification = async () => {
  try {
    const response = await axiosInstance.get('/notifications/check');

    return response.data === 'true' || response.data === true;
  } catch (err) {
    // console.log(`신규 알림 확인 중 오류가 발생했습니다: ${err}`);
    return false;
  }
};
