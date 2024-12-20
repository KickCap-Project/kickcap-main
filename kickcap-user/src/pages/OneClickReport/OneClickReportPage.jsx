import React, { useState } from 'react';
import styled from 'styled-components';
import { localAxios } from '../../util/axios-setting';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Image from '../../components/Common/Image';
import SOS from './../../asset/img/svg/sos.svg';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
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
    margin: ${(props) => props.margin};
    cursor: default;
  `,
};

const { kakao } = window;

const OneClickReportPage = () => {
  const axiosInstance = localAxios();
  const navigate = useNavigate();
  const topText =
    '킥보드 이용 중 긴급 상황 발생 시\n 가까운 관할 경찰서로 신고가 접수됩니다.\n\n[제공 정보]\n신고자 정보 및 GPS 위치';
  const bottomText = '허위 신고 적발 시 112신고처리법에 따라\n형사처벌을 받을 수 있습니다.';
  const loadingText = '신고 중입니다.\n\n잠시만 기다려주세요...';

  const [isLoading, setIsLoading] = useState(false);

  // 1. 위치 반환
  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject('위치 접근 권한이 거부되었습니다.');
              break;
            case error.POSITION_UNAVAILABLE:
              reject('위치 정보를 사용할 수 없습니다.');
              break;
            case error.TIMEOUT:
              reject('위치 요청이 시간이 초과되었습니다.');
              break;
            default:
              reject('알 수 없는 오류가 발생했습니다.');
              break;
          }
        });
      } else {
        reject('Geolocation을 사용할 수 없습니다.');
      }
    });
  };

  // 위치로부터 주소 및 법정동코드 반환
  const getAddressAndCode = async (lat, lng) => {
    return new Promise((resolve, reject) => {
      if (kakao && kakao.maps.services) {
        const geocoder = new kakao.maps.services.Geocoder();

        // 2. 위치로부터 주소 수신
        geocoder.coord2Address(lng, lat, (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const address = result[0].road_address?.address_name || result[0].address?.address_name;

            if (!address) return reject('주소 정보를 찾을 수 없습니다.');

            // 3. 위치로부터 법정동코드 수신
            geocoder.coord2RegionCode(lng, lat, (regionResult, regionStatus) => {
              if (regionStatus === kakao.maps.services.Status.OK) {
                const regionCode = regionResult.find((region) => region.region_type === 'B')?.code;

                // 4. 주소, 법정동코드 반환
                if (regionCode) {
                  resolve({ address, code: regionCode });
                } else {
                  reject('법정동 코드를 찾을 수 없습니다.');
                }
              } else {
                reject('법정동 코드를 조회할 수 없습니다.');
              }
            });
          } else {
            reject('위치를 주소로 변환하는 중 오류가 발생했습니다.');
          }
        });
      } else {
        reject('Kakao Map services가 로드되지 않았습니다.');
      }
    });
  };

  const reportSOS = async () => {
    try {
      // 위/경도 반환
      const pos = await getGeolocation();
      const { latitude: lat, longitude: lng } = pos.coords;

      // 주소, 법정동코드 반환
      const { address, code } = await getAddressAndCode(lat, lng);

      return { lat, lng, address, code };
    } catch (err) {
      throw new Error(err);
    }
  };

  const onClickSOS = async () => {
    if (!window.confirm('허위 신고 적발 시 112신고처리법에 따라 형사처벌을 받을 수 있습니다. 신고하시겠습니까?')) {
      return;
    }

    try {
      setIsLoading(true);
      const { lat, lng, address, code } = await reportSOS();

      await axiosInstance.post('/reports/accident', {
        lat,
        lng,
        addr: address,
        code,
      });

      alert('신고가 접수되었습니다. 접수된 경찰서에서 유선 연락이 올 수 있으니 참고바랍니다.');
      navigate('/main');
    } catch (err) {
      alert('신고 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <s.Container>
      <Header title="원 클릭 신고" />
      <s.MainArea>
        {isLoading ? (
          <>
            <s.Text size={'20px'} margin={'5vh'}>
              {loadingText}
            </s.Text>
            <LoadingSpinner />
          </>
        ) : (
          <>
            <s.Text size={'15px'} color={'black'}>
              {topText}
            </s.Text>
            <Image src={SOS} margin={'3vh'} onClick={onClickSOS} cursor="pointer" />
            <s.Text size={'20px'}>{bottomText}</s.Text>
          </>
        )}
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};
export default OneClickReportPage;
