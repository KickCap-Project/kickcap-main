import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

// 알림 목록 조회
export const getNotificationList = async () => {
  try {
    const response = await axiosInstance.get(`/notifications`);

    console.log(`GET response.status: ${response.status}`);

    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`알림 내역을 불러오는 중 문제가 발생했습니다: ${response.status}`);
      return [];
    }
  } catch (err) {
    console.log(`알림 내역을 불러오는 데 실패했습니다: ${err}`);
    return [];
  }
};

// 알림 읽음 처리
export const setIsReadNote = async (nid) => {
  try {
    const response = await axiosInstance.post(`/notifications/read`, null, {
      params: {
        nid,
      },
    });

    console.log(`${nid} POST response.status: ${response.status}`);

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return true;
    }
  } catch (err) {
    console.log(`알림 상태 변경 중 오류: ${err}`);
    return false;
  }
};

// 메인 페이지에서 알림 확인
export const checkNotification = async () => {
  try {
    const response = await axiosInstance.get(`/notifications/check`);

    if (response.status === 200) {
      return response.data === 'true' || response.data === true;
    }
  } catch (err) {
    console.log(`신규 알림 확인 중 오류가 발생했습니다: ${err}`);
    return false;
  }
};
