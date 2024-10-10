import { localAxios } from '../../util/axios-setting';

const local = localAxios();

// export const getComplaintTotalCount = async (status, name) => {
//   // 게시판 총 개수
//   const response = await local.get(`/objections/policeCount`, { params: { status, name } });
//   return response.data; // 응답의 데이터를 반환
// };

// export const getComplaintList = async (status, pageNo, name) => {
//   // 목록 조회
//   const response = await local.get(`/objections/police`, { params: { status, pageNo, name } });
//   return response.data; // 응답의 데이터를 반환
// };

export const getComplaintTotalCount = async (status, phone, success, fail) => {
  // 이의게시판 총 개수
  await local.get(`/objections/policeCount`, { params: { status, phone } }).then(success).catch(fail);
};

export const getComplaintList = async (status, pageNo, phone, success, fail) => {
  // 이의목록 조회
  await local.get(`/objections/police`, { params: { status, pageNo, phone } }).then(success).catch(fail);
};

export const getListDetail = async (objectionId, success, fail) => {
  // 목록 상세 조회
  await local.get(`/objections/${objectionId}`).then(success).catch(fail);
};
// 사유답변
export const postAnswer = async (objectionId, content, success, fail) => {
  await local.post(`/objections/${objectionId}/answer`, content).then(success).catch(fail);
};

// 고지서취소
export const postCancel = async (objectionId, content, success, fail) => {
  await local.post(`/objections/${objectionId}/cancel`, content).then(success).catch(fail);
};
