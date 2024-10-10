import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const getReportTotalCount = async (violationType) => {
  // 게시판 총 개수
  const response = await local.get(`/reports/count?violationType=${violationType}`);
  return response.data; // 응답의 데이터를 반환
};

export const getReportList = async (violationType, pageNo) => {
  // 목록 조회
  const response = await local.get(`/reports?violationType=${violationType}&pageNo=${pageNo}`);
  return response.data; // 응답의 데이터를 반환
};

export const getReportEndTotalCount = async (violationType) => {
  // 게시판 총 개수
  const response = await local.get(`/reports/end/count?violationType=${violationType}`);
  return response.data; // 응답의 데이터를 반환
};

export const getReportEndList = async (violationType, pageNo) => {
  // 목록 조회
  const response = await local.get(`/reports/end?violationType=${violationType}&pageNo=${pageNo}`);
  return response.data; // 응답의 데이터를 반환
};

export const getListDetail = async (reportId, success, fail) => {
  // 목록 상세 조회
  await local.get(`/reports/${reportId}`).then(success).catch(fail);
};

export const getCrackInfo = async (memberId, reportId, success, fail) => {
  // 단속자 정보 조회
  await local.get(`/members/${memberId}/info`, { params: { reportId } }).then(success).catch(fail);
};

export const getParkData = async (data, success, fail) => {
  // 주차장 정보 조회
  await local
    .get(`/parking-data`, { params: { lat: data.lat, lng: data.lng } })
    .then(success)
    .catch(fail);
};

export const postApprove = async (reportId, success, fail) => {
  // 신고 승인
  await local.post(`/reports/${reportId}/approve`).then(success).catch(fail);
};

export const postReject = async (reportId, success, fail) => {
  // 신고 반려
  await local.post(`/reports/${reportId}/reject`).then(success).catch(fail);
};
