import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import accidentIcon from '../../asset/accident.png';
import '../../styles/etc.css';
const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
  test: styled.div`
    width: 150px;
    height: 50px;
  `,
};

const { kakao } = window;

const EmergencyMap = ({ accident }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(33.450701, 126.570667), level: 4 };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);

    // 마커 이미지 설정
    const accidentImg = new kakao.maps.MarkerImage(accidentIcon, new kakao.maps.Size(40, 40));

    // 불법주차 마커 추가
    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(accident.lat, accident.lng),
      map: kakaoMap,
      title: '사고 지점',
      image: accidentImg,
    });

    if (accident !== undefined) {
      //사고지점 위치로 지도중심 변경
      kakaoMap.setCenter(new kakao.maps.LatLng(accident.lat, accident.lng));
    }
  }, [accident]);

  return <s.Container id="map"></s.Container>;
};

export default EmergencyMap;
