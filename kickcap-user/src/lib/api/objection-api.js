import { localAxios } from "../../util/axios-setting";

const axiosInstance = localAxios();

export const getObjectionList = async (status, pageNo) => {
  try {
    const response = await axiosInstance.get('/objections/user', {
      params: {
        status,
        pageNo,
      }
    });

    if (response.status === 200) {
      console.log(`이의제기 목록 조회를 성공적으로 수행했습니다.`);
      return response.data
    } else {
      console.log(`이의제기 목록 조회 중 문제가 발생했습니다: ${response.status}`);
      return [];
    }
  } catch (err) {
    console.log(`이의제기 목록 조회 GET 요청 실패: ${err}`);
    return [];
  }
};

export const getObjectionDetail = async (objectionId) => {
  try {
    const response = await axiosInstance.get(`/objections/${objectionId}`);

    if (response.status === 200) {
      console.log(`이의제기 상세 조회를 성공적으로 수행했습니다.`);
      return response.data;
    } else {
      console.log(`이의제기 상세 요청 중 문제가 발생했습니다: ${response.status}`);
      return null;
    }
  } catch (err) {
    console.log(`이의제기 상세 조회 GET 요청 실패: ${err}`);
    return null;
  }
}

export const deleteObjectionDetail = async (objectionId) => {
  try {
    const response = await axiosInstance.delete(`/objections/${objectionId}`);

    if (response.status === 204) {
      console.log(`이의제기가 성공적으로 삭제되었습니다.`);
      return response;
    } else {
      console.log(`이의제기 상세 DELETE 요청 중 문제가 발생했습니다: ${response.status}`);
    }
  } catch (err) {
    console.log(`이의제기 상세 DELETE 요청 실패: ${err}`);
  } 
}

export const putObjectionDetail = async (objectionId, title, content) => {
  const updatedData = {
    title: title,
    content: content,
  };

  try {
    const response = await axiosInstance.put(`/objections/${objectionId}`, updatedData);
    
    if (response.status === 200) {
      console.log(`이의제기 수정이 정상적으로 요청되었습니다.`);
      return response;
    } else {
      console.log(`이의제기 수정 PUT 요청 중 문제가 발생했습니다: ${response.status}`);
    }
  } catch (err) {
    console.log(`이의제기 수정 PUT 요청 실패: ${err}`);
  }
}