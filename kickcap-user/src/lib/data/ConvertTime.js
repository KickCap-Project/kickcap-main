import { DateTime } from 'luxon';

export const convertExifToISO = (exifDate) => {
  // EXIF 메타데이터 시간 포맷: "YYYY:MM:DD HH:mm:ss"
  const exifFormat = 'yyyy:MM:dd HH:mm:ss';

  // EXIF 시간 문자열을 한국 시간대의 DateTime 객체로 변환
  const dateTime = DateTime.fromFormat(exifDate, exifFormat, { zone: 'Asia/Seoul' });

  // ISO 8601 형식으로 변환 (예: 2024-09-21T13:13:00+09:00)
  const isoString = dateTime.toISO();
  return isoString;
};
