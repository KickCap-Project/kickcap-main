import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import parkIcon from '../../asset/park.png';
import kickIcon from '../../asset/kickboard.png';
const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
};

const { kakao } = window;

const ParkingMap = ({ kickBoard, Park }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(33.450701, 126.570667), level: 3 };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);

    // 마커 이미지 설정
    const kickImg = new kakao.maps.MarkerImage(kickIcon, new kakao.maps.Size(40, 40));
    const parkImg = new kakao.maps.MarkerImage(parkIcon, new kakao.maps.Size(40, 40));

    // 불법주차 마커 추가
    new kakao.maps.Marker({
      position: new kakao.maps.LatLng(kickBoard.lat, kickBoard.lng),
      map: kakaoMap,
      title: kickBoard.title,
      image: kickImg,
    });

    // 주차장 마커 추가
    Park.forEach((lot) => {
      new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lot.lat, lot.lng),
        map: kakaoMap,
        title: lot.title,
        image: parkImg,
      });
    });
    if (kickBoard !== undefined) {
      //킥보드 위치로 지도중심 변경
      kakaoMap.setCenter(new kakao.maps.LatLng(kickBoard.lat, kickBoard.lng));
    }
  }, [kickBoard, Park]);

  return <s.Container id="map"></s.Container>;
};

export default ParkingMap;
