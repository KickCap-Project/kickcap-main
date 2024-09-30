import { localAxios } from '../../util/axios-setting';

const local = localAxios();

export const getCrackTotalCount = async (violationType, success, fail) => {
  // 신고게시판 총 개수
  await local.get(`/crackdowns/count?violationType=${violationType}`).then(success).catch(fail);
};

export const getCrackList = async (violationType, pageNo, success, fail) => {
  // 신고목록 조회
  await local.get(`/crackdowns?&violationType=${violationType}&pageNo=${pageNo}`).then(success).catch(fail);
};

export const getListDetail = async (reportId, success, fail) => {
  // 목록 상세 조회
  await local.get(`/reports/${reportId}`).then(success).catch(fail);
};
