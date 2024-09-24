import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import nopark from '../../asset/nopark.png';
import helmet from '../../asset/helmet.png';
import people from '../../asset/people.png';
import road from '../../asset/road.png';
import sidewalk from '../../asset/sidewalk.png';
import cam1 from '../../asset/cam1.png';
import cam2 from '../../asset/cam2.png';
import cam3 from '../../asset/cam3.png';
import cam4 from '../../asset/cam4.png';
import { useLocation, useNavigate, useParams } from 'react-router';
import { markerData } from '../../lib/data/BoardData.js';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
};
const { kakao } = window;

const CameraMap = ({ point }) => {
  const location = useParams();
  const navigate = useNavigate();
  const data = useLocation().state?.data || null; //data 미존재시 => 직접 url입력상황이면 에러페이지 이동하는ㄴ거 하기
  console.log(location);
  console.log(data);
  const [map, setMap] = useState(null);

  //처음 지도 그리기
  useEffect(() => {
    if (data === null) {
      navigate('*');
      return;
    }
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(data.lat, data.lng) };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);

    // 마커 이미지 설정
    const noparkImg = new kakao.maps.MarkerImage(nopark, new kakao.maps.Size(40, 40));
    const helmetImg = new kakao.maps.MarkerImage(helmet, new kakao.maps.Size(40, 40));
    const peopleImg = new kakao.maps.MarkerImage(people, new kakao.maps.Size(40, 40));
    const roadImg = new kakao.maps.MarkerImage(road, new kakao.maps.Size(40, 40));
    const sidewalkImg = new kakao.maps.MarkerImage(sidewalk, new kakao.maps.Size(40, 40));
    const cam1Img = new kakao.maps.MarkerImage(cam1, new kakao.maps.Size(40, 40));
    const cam2Img = new kakao.maps.MarkerImage(cam2, new kakao.maps.Size(40, 40));
    const cam3Img = new kakao.maps.MarkerImage(cam3, new kakao.maps.Size(40, 40));
    const cam4Img = new kakao.maps.MarkerImage(cam4, new kakao.maps.Size(40, 40));

    {
      markerData.map((data, index) => console.log(data));
    }

    // // 불법주차 마커 추가
    // new kakao.maps.Marker({
    //   position: new kakao.maps.LatLng(kickBoard.lat, kickBoard.lng),
    //   map: kakaoMap,
    //   title: kickBoard.title,
    //   image: kickImg,
    // });

    // // 주차장 마커 추가
    // Park.forEach((lot) => {
    //   new kakao.maps.Marker({
    //     position: new kakao.maps.LatLng(lot.lat, lot.lng),
    //     map: kakaoMap,
    //     title: lot.title,
    //     image: parkImg,
    //   });
    // });
  }, [data]);

  return <s.Container id="map"></s.Container>;
};

export default CameraMap;
