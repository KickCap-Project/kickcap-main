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
import BoardCameraModal from '../Modal/BoardCameraModal.jsx';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook.js';
import { modalActions, selectIsCamera } from '../../store/modal.js';
import { pageActions, selectBoardNav } from '../../store/page.js';
import { getCCTVInfo, getMarkerData } from '../../lib/api/board-api.js';
import { useSearchParams } from 'react-router-dom';

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

  const navigate = useNavigate();
  const data = useLocation().state?.data || null;
  const [map, setMap] = useState(null);
  const [markerType, setMarkerType] = useState(4);
  const [timeType, setTimeType] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapData, setMapData] = useState({});
  const [cctvData, setCCTVData] = useState({});
  const [clusterer, setClusterer] = useState(null);

  useEffect(() => {
    const sido = searchParams.get('sido');
    const gugun = searchParams.get('gugun');
    getMarkerData(
      sido,
      gugun,
      (resp) => {
        setMapData(resp.data);
      },
      (error) => {
        alert('데이터를 불러오는 도중 에러가 발생했습니다.');
      },
    );
  }, [searchParams]);

  const calculateRatios = (data) => {
    const sum = Array(8).fill(0);
    const indexName = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
    data.forEach((camera) => {
      for (let i = 0; i < 8; i++) {
        sum[i] += camera[indexName[i]];
      }
    });

    const ratios = data.map((camera) => {
      const ratioObj = { lat: camera.lat, lng: camera.lng, idx: camera.idx };
      for (let i = 0; i < 8; i++) {
        ratioObj[i] = sum[i] === 0 ? 0 : (camera[indexName[i]] / sum[i]).toFixed(2);
      }
      return ratioObj;
    });
    return ratios;
  };

  const result = mapData.camDataResponses !== undefined ? calculateRatios(mapData.camDataResponses) : [];

  const handleChangeTimeType = (e) => {
    setTimeType(e.target.value);
  };

  useEffect(() => {
    if (data === null) {
      navigate('*');
      return;
    }
    const container = document.getElementById('map');
    const options = { center: new kakao.maps.LatLng(data.lat, data.lng), level: 8 };
    const kakaoMap = new kakao.maps.Map(container, options);
    setMap(kakaoMap);

    const newClusterer = new kakao.maps.MarkerClusterer({
      map: kakaoMap,
      averageCenter: true,
      minLevel: 8,
    });
    setClusterer(newClusterer);

    return () => {
      newClusterer.clear();
    };
  }, [data]);
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

  useEffect(() => {
    const newMarkers = [];

    result.map((data) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(data.lat, data.lng),
        title: data.idx,
        image: pickCameraMarker(data[timeType]),
      });

      kakao.maps.event.addListener(marker, 'click', async () => {
        setCameraIdx(data.idx);
        await getCCTVInfo(
          data.idx,
          timeType,
          (resp) => {
            setCCTVData(resp.data);
          },
          (error) => {
            alert('잠시 후 다시 시도해주세요.');
          },
        );
        handleOpenCamera(true);
      });

      newMarkers.push(marker);
    });

    mapData.pointDataResponses &&
      mapData.pointDataResponses.map((data) => {
        if (markerType === data.type && timeType == data.timeIndex) {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(data.lat, data.lng),
            title:
              data.type === 1
                ? '다인 승차'
                : data.type === 2
                ? '보도 주행'
                : data.type === 3
                ? '안전모 미착용'
                : data.type === 4
                ? '불법 주차'
                : data.type === 5
                ? '지정차로 위반'
                : '사고 지점',
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
          newMarkers.push(marker);
        }
      });

    if (clusterer) {
      clusterer.clear();
      clusterer.addMarkers(newMarkers);
    }
  }, [data, markerType, timeType, mapData, clusterer]);

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
    );
  };

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
            <s.selectValue value={4}>12 ~ 14시</s.selectValue>
            <s.selectValue value={5}>15 ~ 17시</s.selectValue>
            <s.selectValue value={6}>18 ~ 20시</s.selectValue>
            <s.selectValue value={7}>21 ~ 23시</s.selectValue>
          </s.selectArea>
        </s.mapArea>
      </s.Container>
      <BoardCameraModal
        open={isCamera}
        toggleModal={handleOpenCamera}
        idx={cameraIdx}
        data={cctvData.crackdown ? cctvData : null}
      />
    </>
  );
};

export default CameraMap;
