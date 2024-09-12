export const ViolationType = {
  1: {
    type: '다인 승차',
    fine: 40000,
  },
  2: {
    type: '보도 주행',
    fine: 30000,
  },
  3: {
    type: '안전모 미착용',
    fine: 20000,
  },
  4: {
    type: '불법 주차',
    fine: 20000,
  },
  5: {
    type: '지정 차로 위반',
    fine: 10000,
  },
};

export const isFlagType = {
  0: {
    status: '미납',
    color: '#F5F7FA',
  },
  1: {
    status: '완납',
    color: '#D3D3D3',
  },
  2: {
    status: '이의 중',
    color: '#0054A6',
  },
  3: {
    status: '마감 2일 전',
    color: '#FF6E65',
  },
};

export const ViolationDetailType = {
  idx: '고지서 번호',
  kickBoard: '킥보드 번호',
  date: '위반 일시',
  place: '위반 장소',
  type: '위반 내역',
  demerit: '벌점',
  money: '범칙금',
  deadLine: '납부 기한',
  police: '관할 경찰서',
  isFlag: '납부 상태',
};
