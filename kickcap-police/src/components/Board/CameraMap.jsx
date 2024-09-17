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
import { useLocation, useParams } from 'react-router';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
  `,
};
const { kakao } = window;

const CameraMap = ({ point }) => {
  const location = useParams();
  const data = useLocation().state.data; //data 미존재시 => 직접 url입력상황이면 에러페이지 이동하는ㄴ거 하기
  console.log(location);
  console.log(data);
  const [map, setMap] = useState(null);

  //처음 지도 그리기
  useEffect(() => {
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(data.lat, data.lng) };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);
  }, [data]);

  return <s.Container id="map"></s.Container>;
};

export default CameraMap;
