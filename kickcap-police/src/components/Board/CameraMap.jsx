import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import nopark from '../../asset/nopark.png';
import helmet from '../../asset/helmet.png';
import people from '../../asset/people.png';
import road from '../../asset/road.png';
import sidewalk from '../../asset/sidewalk.png';
import accident from '../../asset/accident.png';
import cam1 from '../../asset/cam1.png';
import cam2 from '../../asset/cam2.png';
import cam3 from '../../asset/cam3.png';
import cam4 from '../../asset/cam4.png';
import { useLocation, useNavigate, useParams } from 'react-router';
import { markerData } from '../../lib/data/BoardData.js';
import BoardCameraModal from '../Modal/BoardCameraModal.jsx';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook.js';
import { modalActions, selectIsCamera } from '../../store/modal.js';
import { pageActions, selectBoardNav } from '../../store/page.js';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  NavArea: styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: space-between;
  `,
  mapArea: styled.div`
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  `,
  TypeText: styled.div`
    width: fit-content;
    text-align: center;
    font-weight: 700;
    font-size: ${(props) => props.size || '15px'};
    color: ${(props) => props.color || props.theme.textBasic};
    cursor: pointer;
  `,
  selectArea: styled.select`
    width: 100px;
    height: 30px;
    /* border: 1px solid red; */
    position: absolute;
    z-index: 100;
    margin: 10px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    font-weight: 700;
    color: #fff;
    text-align: center;
    cursor: pointer;
  `,
  selectValue: styled.option`
    cursor: pointer;
  `,
};
const { kakao } = window;

const CameraMap = ({ point }) => {
  const isCamera = useAppSelector(selectIsCamera);
  const [cameraIdx, setCameraIdx] = useState();
  const dispatch = useAppDispatch();
  const handleOpenCamera = (isFlag) => {
    dispatch(modalActions.ChangeIsCamera(isFlag));
  };

  const location = useParams();
  const navigate = useNavigate();
  const data = useLocation().state?.data || null; //data 미존재시 => 직접 url입력상황이면 에러페이지 이동하는ㄴ거 하기
  // console.log(location);
  // console.log(data);
  const [map, setMap] = useState(null);
  const [markerType, setMarkerType] = useState(4); // 추가된 상태
  const [timeType, setTimeType] = useState(0);
  const [markers, setMarkers] = useState([]);

  // 카메라 배열 전처리
  const calculateRatios = (data) => {
    const sum = Array(8).fill(0);

    // 각 카메라 데이터에서 키(0~7)의 값들을 합산
    data.forEach((camera) => {
      for (let i = 0; i < 8; i++) {
        sum[i] += camera[i];
      }
    });

    // 비율 계산
    const ratios = data.map((camera) => {
      const ratioObj = { lat: camera.lat, lng: camera.lng, idx: camera.idx };
      for (let i = 0; i < 8; i++) {
        ratioObj[i] = sum[i] === 0 ? 0 : (camera[i] / sum[i]).toFixed(2); // 0으로 나누는 것 방지
      }
      return ratioObj;
    });

    return ratios;
  };

  const result = calculateRatios(markerData.camera);
  console.log(result);
  ////////

  const handleChangeTimeType = (e) => {
    setTimeType(e.target.value);
  };

  //처음 지도 그리기
  useEffect(() => {
    if (data === null) {
      navigate('*');
      return;
    }
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(data.lat, data.lng), level: 4 };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);

    // 마커 이미지 설정
    const noparkImg = new kakao.maps.MarkerImage(nopark, new kakao.maps.Size(40, 40));
    const helmetImg = new kakao.maps.MarkerImage(helmet, new kakao.maps.Size(40, 40));
    const peopleImg = new kakao.maps.MarkerImage(people, new kakao.maps.Size(40, 40));
    const roadImg = new kakao.maps.MarkerImage(road, new kakao.maps.Size(40, 40));
    const sidewalkImg = new kakao.maps.MarkerImage(sidewalk, new kakao.maps.Size(40, 40));
    const accidentImg = new kakao.maps.MarkerImage(accident, new kakao.maps.Size(40, 40));
    const cam1Img = new kakao.maps.MarkerImage(cam1, new kakao.maps.Size(40, 40));
    const cam2Img = new kakao.maps.MarkerImage(cam2, new kakao.maps.Size(40, 40));
    const cam3Img = new kakao.maps.MarkerImage(cam3, new kakao.maps.Size(40, 40));
    const cam4Img = new kakao.maps.MarkerImage(cam4, new kakao.maps.Size(40, 40));

    // 기존 마커 제거
    markers.forEach((marker) => {
      marker.setMap(null);
    });

    let center = kakaoMap.getCenter();

    const pickCameraMarker = (num) => {
      if (num <= 0.2) {
        return cam1Img;
      } else if (num > 0.2 && num <= 0.4) {
        return cam2Img;
      } else if (num > 0.4 && num <= 0.6) {
        return cam3Img;
      } else {
        return cam4Img;
      }
    };

    const newMarkers = [];

    // markerData.camera.map((data, index) => {
    //   const marker = new kakao.maps.Marker({
    //     position: new kakao.maps.LatLng(data.lat, data.lng),
    //     title: data.idx,
    //     map: kakaoMap,
    //     image: data.level === 0 ? cam1Img : data.level === 1 ? cam2Img : data.level === 2 ? cam3Img : cam4Img,
    //   });

    //   // 클릭 이벤트 추가
    //   kakao.maps.event.addListener(marker, 'click', () => {
    //     setCameraIdx(data.idx);
    //     handleOpenCamera(true);
    //   });

    //   newMarkers.push(marker);
    // });
    result.map((data, index) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(data.lat, data.lng),
        title: data.idx,
        map: kakaoMap,
        image: pickCameraMarker(data[timeType]),
      });

      // 클릭 이벤트 추가
      kakao.maps.event.addListener(marker, 'click', () => {
        setCameraIdx(data.idx);
        handleOpenCamera(true);
      });

      newMarkers.push(marker);
    });

    markerData.point.map((data, index) => {
      if (markerType === data.type && timeType == data.timeIndex) {
        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(data.lat, data.lng),
          map: kakaoMap,
          image:
            data.type === 1
              ? peopleImg
              : data.type === 2
              ? sidewalkImg
              : data.type === 3
              ? helmetImg
              : data.type === 4
              ? noparkImg
              : data.type === 5
              ? roadImg
              : accidentImg,
        });

        // 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', () => {
          alert(`Point Type ${data.type} clicked!`);
        });

        newMarkers.push(marker);
      }
    });

    // 새 마커 설정
    setMarkers(newMarkers);
  }, [data, markerType, timeType]);

  const type = useAppSelector(selectBoardNav);
  const handleClickIcon = (mode) => {
    dispatch(pageActions.changeboardType(mode));
    setMarkerType(
      mode === 'park'
        ? 4
        : mode === 'helmet'
        ? 3
        : mode === 'peoples'
        ? 1
        : mode === 'sideWalk'
        ? 2
        : mode === 'road'
        ? 5
        : 6,
    ); // 마커 타입 설정
  };
  console.log(markerType);
  console.log(timeType);

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };

  return (
    <>
      <s.Container>
        <s.NavArea>
          <s.TypeText onClick={() => handleClickIcon('park')} color={getColor('park')}>
            불법 주차
          </s.TypeText>
          <s.TypeText onClick={() => handleClickIcon('helmet')} color={getColor('helmet')}>
            안전모 미착용
          </s.TypeText>
          <s.TypeText onClick={() => handleClickIcon('peoples')} color={getColor('peoples')}>
            다인 승차
          </s.TypeText>
          <s.TypeText onClick={() => handleClickIcon('sideWalk')} color={getColor('sideWalk')}>
            보도 주행
          </s.TypeText>
          <s.TypeText onClick={() => handleClickIcon('road')} color={getColor('road')}>
            지정차로 위반
          </s.TypeText>
          <s.TypeText onClick={() => handleClickIcon('accident')} color={getColor('accident')}>
            사고발생
          </s.TypeText>
        </s.NavArea>
        <s.mapArea id="map">
          <s.selectArea value={timeType} onChange={handleChangeTimeType}>
            <s.selectValue value={0}>0 ~ 2시</s.selectValue>
            <s.selectValue value={1}>3 ~ 5시</s.selectValue>
            <s.selectValue value={2}>6 ~ 8시</s.selectValue>
            <s.selectValue value={3}>9 ~ 11시</s.selectValue>
            <s.selectValue value={4}>12 ~ 15시</s.selectValue>
            <s.selectValue value={5}>15 ~ 18시</s.selectValue>
            <s.selectValue value={6}>18 ~ 20시</s.selectValue>
            <s.selectValue value={7}>21 ~ 23시</s.selectValue>
          </s.selectArea>
        </s.mapArea>
      </s.Container>
      <BoardCameraModal open={isCamera} toggleModal={handleOpenCamera} idx={cameraIdx} />
    </>
  );
};

export default CameraMap;
