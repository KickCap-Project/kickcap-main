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

  return `${dateTime.toFormat('yyyy-MM-dd')} ${period} ${hour}:${dateTime.toFormat('mm:ss')}`;
};
