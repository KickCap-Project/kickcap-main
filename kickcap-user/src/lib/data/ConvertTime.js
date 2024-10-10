import { DateTime } from 'luxon';

// EXIF to ISO8601(+09:00)
export const convertExifToISO = (exifDate) => {
  // EXIF 메타데이터 시간 포맷: "YYYY:MM:DD HH:mm:ss"
  const exifFormat = 'yyyy:MM:dd HH:mm:ss';

  // EXIF 시간 문자열을 한국 시간대의 DateTime 객체로 변환
  const dateTime = DateTime.fromFormat(exifDate, exifFormat, { zone: 'Asia/Seoul' });

  // ISO 8601 형식으로 변환 (예: 2024-09-21T13:13:00+09:00)
  const isoString = dateTime.toISO();
  return isoString;
};

// ISO8601(Z) to Korean
// violation
export const convertToKoreanTimeString = (isoString) => {
  // Luxon으로 ISO 문자열을 DateTime 객체로 변환
  const dateTime = DateTime.fromISO(isoString, { zone: 'Asia/Seoul' });

  // 시간을 12시간제(오전/오후)로 변환하여 출력
  const period = dateTime.hour >= 12 ? '오후' : '오전';
  const hour = dateTime.hour % 12 || 12; // 12시간제로 변환, 0시일 경우 12시로 변환

  // 분과 초는 그대로 포맷팅
  const minute = dateTime.toFormat('mm');
  const second = dateTime.toFormat('ss'); // 소수점이 있는 초는 제거됨

  return `${dateTime.toFormat('yyyy-MM-dd')} ${period} ${hour}:${minute}:${second}`;
};

// objection에서만 사용
export const convertTimeString = (isoString, type) => {
  const date = new Date(isoString.replace('Z', ''));

  const hours = date.getHours();
  const period = hours >= 12 ? '오후' : '오전';
  const hour = hours % 12 || 12;

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  switch (type) {
    case 'YMDHMS':
      return `${year}-${month}-${day} ${period} ${hour}:${minutes}:${seconds}`;
    case 'YMD':
      return `${year}-${month}-${day}`;
    default:
      break;
  }
};

// notification에서만 사용
// 시간 차이를 'n분 전', 'n시간 전', 'n일 전', 'n달 전', 'n년 전'으로 변환하는 함수
export const timeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date; // 밀리초 단위 시간 차이
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // 분 단위 차이

  if (diffInMinutes < 1) {
    return '방금 전'; // 1분 미만일 때
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`; // 1시간 미만일 때
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`; // 1일 미만일 때
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`; // 1달 미만일 때
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}달 전`; // 1년 미만일 때
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`; // 1년 이상일 때
};
