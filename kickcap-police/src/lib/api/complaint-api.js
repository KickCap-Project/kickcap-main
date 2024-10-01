import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const getComplaintTotalCount = async (status, name, success, fail) => {
  // 이의게시판 총 개수
  await local.get(`/objections/policeCount`, { params: { status, name } }).then(success).catch(fail);
};

export const getComplaintList = async (status, pageNo, name, success, fail) => {
  // 이의목록 조회
  await local.get(`/objections/police`, { params: { status, pageNo, name } }).then(success).catch(fail);
};

export const getListDetail = async (objectionId, success, fail) => {
  // 목록 상세 조회
  await local.get(`/objections/${objectionId}`).then(success).catch(fail);
};
// 사유답변
export const postAnswer = async (objectionId, content, success, fail) => {
  await local.post(`/objections/${objectionId}/answer`, content).then(success).catch(fail);
};
