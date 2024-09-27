import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const getReportTotalCount = async (violationType, success, fail) => {
  // 신고게시판 총 개수
  await local.get(`/reports/count?violationType=${violationType}`).then(success).catch(fail);
};

export const getReportList = async (violationType, pageNo, success, fail) => {
  // 신고목록 조회
  await local.get(`/reports?violationType=${violationType}&pageNo=${pageNo}`).then(success).catch(fail);
};

export const getReportEndTotalCount = async (violationType, success, fail) => {
  // 완료건 게시글 총 개수
  await local.get(`/reports/end/count?violationType=${violationType}`).then(success).catch(fail);
};

export const getReportEndList = async (violationType, pageNo, success, fail) => {
  // 완료 목록 조회
  await local.get(`/reports/end?violationType=${violationType}&pageNo=${pageNo}`).then(success).catch(fail);
};

export const getListDetail = async (reportId, success, fail) => {
  // 목록 상세 조회
  await local.get(`/report/${reportId}`).then(success).catch(fail);
};

export const getCrackInfo = async (memberId, success, fail) => {
  // 단속자 정보 조회
  await local.get(`/members/${memberId}/info`).then(success).catch(fail);
};

export const getParkData = async (success, fail) => {
  // 주차장 정보 조회
  await local.get(`/parking-data`).then(success).catch(fail);
};

export const postApprove = async (reportId, success, fail) => {
  // 신고 승인
  await local.post(`/reports/${reportId}/approve`).then(success).catch(fail);
};

export const postReject = async (reportId, success, fail) => {
  // 신고 반려
  await local.post(`/reports/${reportId}/reject`).then(success).catch(fail);
};
