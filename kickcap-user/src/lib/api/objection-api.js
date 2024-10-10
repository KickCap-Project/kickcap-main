import { localAxios } from '../../util/axios-setting';

const axiosInstance = localAxios();

export const getObjectionList = async (status, pageNo) => {
  try {
    const response = await axiosInstance.get('/objections/user', {
      params: {
        status,
        pageNo,
      },
    });

    return response.status === 200 ? response.data : [];
  } catch (err) {
    alert('이의제기 목록 조회 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return [];
  }
};

export const getObjectionDetail = async (objectionId) => {
  try {
    const response = await axiosInstance.get(`/objections/user/${objectionId}`);

    return response;
  } catch (err) {
    alert('이의제기 상세 조회 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const deleteObjectionDetail = async (objectionId) => {
  try {
    const response = await axiosInstance.delete(`/objections/${objectionId}`);

    return response;
  } catch (err) {
    alert('이의제기 삭제 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

export const putObjectionDetail = async (objectionId, title, content) => {
  const updatedData = {
    title: title,
    content: content,
  };

  try {
    const response = await axiosInstance.post(`/objections/${objectionId}`, updatedData);

    return response;
  } catch (err) {
    alert('이의제기 내용 수정 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};
