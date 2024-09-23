import React, { useEffect, useRef } from 'react';
import { setLocation } from '../../store/location';
import { useAppDispatch } from './useReduxHook';

const { kakao } = window;

const useReportMap = (loc) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const dispatch = useAppDispatch();

  const handleSetLocation = () => {
    return new Promise((resolve, reject) => {
      const center = mapInstanceRef.current.getCenter();

      if (kakao && kakao.maps.services) {
        const geocoder = new kakao.maps.services.Geocoder();
        const getLat = center.getLat();
        const getLng = center.getLng();

        let locationData = {
          latitude: getLat,
          longitude: getLng,
          address: '',
          code: '',
        };

        // 1. 주소 가져오기
        const callbackAddr = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const addr = result[0].address?.address_name;
            const road_addr = result[0].road_address?.address_name;

            if (!addr && !road_addr) {
              alert(`위치를 다시 한 번 확인해주세요.`);
              return reject('No valid address found.');
            }

            locationData.address = road_addr ? road_addr : addr;

            // 2. 법정동 가져오기
            geocoder.coord2RegionCode(getLng, getLat, callbackRegionCode);
          } else {
            console.log(`주소 조회 오류: ${status}`);
            reject(`주소 조회 오류: ${status}`);
          }
        };

        // 2. 법정동 코드 가져오기
        const callbackRegionCode = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            result.forEach((region) => {
              if (region.region_type === 'B') {
                locationData.code = region.code;
              }
            });

            console.log(locationData);

            dispatch(setLocation(locationData));
            resolve();
          } else {
            console.log(`법정동 코드 조회 오류: ${status}`);
            reject(`법정동 코드 조회 오류: ${status}`);
          }
        };

        geocoder.coord2Address(getLng, getLat, callbackAddr);
      } else {
        console.log(`Kakao Maps services가 로드되지 않았습니다.`);
        reject(`Kakao Maps services가 로드되지 않았습니다.`);
      }
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      const options = {
        center: new kakao.maps.LatLng(loc.lat, loc.lng),
        level: 3,
      };
      const mapInstance = new kakao.maps.Map(mapRef.current, options);
      mapInstanceRef.current = mapInstance;

      const markerPosition = mapInstance.getCenter();
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: mapInstance,
      });
      markerRef.current = marker;

      kakao.maps.event.addListener(mapInstance, 'center_changed', function () {
        marker.setPosition(mapInstance.getCenter());
      });
    }
  }, [loc]);

  return { mapRef, handleSetLocation };
};

export default useReportMap;
