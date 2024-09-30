import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import parkIcon from '../../asset/park.png';
import kickIcon from '../../asset/kickboard.png';
import '../../styles/etc.css';
const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
  test: styled.div`
    width: 150px;
    height: 50px;
    border: 1px solid red;
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
      title: '신고된 킥보드 주차 위치',
      image: kickImg,
    });

    // 주차장 마커 추가
    Park.forEach((lot) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lot.lat, lot.lng),
        title: lot.detailAddress,
        map: kakaoMap,
        image: parkImg,
      });

      // InfoWindow for parking markers
      const infowindow = new kakao.maps.InfoWindow({ content: `<div class="info-title">${lot.detailAddress}</div>` });

      kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(kakaoMap, marker, infowindow));
      kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
    });
    // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
    function makeOverListener(map, marker, infowindow) {
      return function () {
        infowindow.open(map, marker);
      };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function makeOutListener(infowindow) {
      return function () {
        infowindow.close();
      };
    }

    if (kickBoard !== undefined) {
      //킥보드 위치로 지도중심 변경
      kakaoMap.setCenter(new kakao.maps.LatLng(kickBoard.lat, kickBoard.lng));
    }
  }, [kickBoard, Park]);

  return <s.Container id="map"></s.Container>;
};

export default ParkingMap;
