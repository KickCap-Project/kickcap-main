import React, { useState } from 'react';
import styled from 'styled-components';
import { localAxios } from '../../util/axios-setting';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Image from '../../components/Common/Image';
import SOS from './../../asset/img/svg/sos.svg';
import { useNavigate } from 'react-router';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5vh;
  `,
  Text: styled.div`
    color: ${(props) => (props.color ? props.color : props.theme.mainColor)};
    font-size: ${(props) => props.size};
    font-weight: 600;
    white-space: pre-line;
    text-align: center;
    cursor: default;
  `,
};

const { kakao } = window;

const OneClickReportPage = () => {
  const axiosInstance = localAxios();
  const topText =
    '킥보드 이용 중 긴급 상황 발생 시\n 가까운 관할 경찰서로 신고가 접수됩니다.\n\n[제공 정보]\n신고자 정보 및 GPS 위치';
  const bottomText = '허위 신고 적발 시 112신고처리법에 따라\n형사처벌을 받을 수 있습니다.';
  const navigate = useNavigate();

  const [addr, setAddr] = useState('');
  const [code, setCode] = useState('');

  const reportSOS = () => {
    return new Promise((resolve, reject) => {
      const success = (pos) => {
        const getLat = pos.coords.latitude;
        const getLng = pos.coords.longitude;
        console.log(getLat, getLng);

        if (kakao && kakao.maps.services) {
          const geocoder = new kakao.maps.services.Geocoder();

          // 위/경도 수신 후 주소, 법정동코드 수신
          // 2. 주소 가져오는 콜백 함수, 실행 후 법정동코드 가져오는 함수 실행
          const callbackAddr = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              // 주소 가져오기
              const check_addr = result[0].address?.address_name;
              const check_road_addr = result[0].road_address?.address_name;

              if (!check_addr && !check_road_addr) {
                alert(`주소 정보가 없습니다.`);
                return reject('No valid address found.');
              }

              setAddr(check_road_addr ? check_road_addr : check_addr);

              // 법정동코드 가져오기
              geocoder.coord2RegionCode(getLng, getLat, callbackRegionCode);
            } else {
              reject('위치를 주소로 변환하는 중 오류가 발생했습니다.');
            }
          };

          // 3. 법정동코드 가져오는 콜백 함수
          const callbackRegionCode = (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              result.forEach((region) => {
                if (region.region_type === 'B') {
                  setCode(region.code);
                  resolve({ lat: getLat, lng: getLng });
                }
              });
            } else {
              reject('법정동 코드를 조회할 수 없습니다.');
            }
          };

          // 함수 실행 부분
          geocoder.coord2Address(getLng, getLat, callbackAddr);
        } else {
          // kakao.maps.services 오류 시
          reject('Kakao Map services가 로드되지 않았습니다.');
        }
      };
      const error = (err) => console.log(err);

      if (navigator.geolocation) {
        // 1. 위/경도 좌표 수신
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        // navigator.geolocation 오류 시
        reject('geolocation을 받아올 수 없습니다.');
      }
    });
  };

  const onClickSOS = () => {
    // 클릭 시 이벤트
    if (window.confirm('허위 신고 적발 시 112신고처리법에 따라 형사처벌을 받을 수 있습니다. 신고하시겠습니까?')) {
      // 3. axios.post 요청 보내기
      reportSOS()
        .then((position) => {
          const { lat, lng } = position;

          axiosInstance
            .post('/reports/accident', {
              lat,
              lng,
              addr,
              code,
            })
            .then((response) => {
              console.log(response);
              alert('신고가 접수되었습니다. 접수된 경찰서에서 유선 연락이 올 수 있으니 참고바랍니다.');
              navigate('/main');
            })
            .catch((error) => {
              alert('신고 중 문제가 발생했습니다.');
              console.log(error);
            });
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <s.Container>
      <Header title="원 클릭 신고" />
      <s.MainArea>
        <s.Text size={'15px'} color={'black'}>
          {topText}
        </s.Text>
        <Image src={SOS} margin={'3vh'} onClick={() => onClickSOS()} cursor="pointer" />
        <s.Text size={'20px'}>{bottomText}</s.Text>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};
export default OneClickReportPage;
