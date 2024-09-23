import React, { useEffect, useRef } from 'react';

const { kakao } = window;

const useReportMap = (loc) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const handleSetLocation = () => {
    return new Promise((resolve, reject) => {
      const center = mapInstanceRef.current.getCenter();

      if (kakao && kakao.maps.services) {
        const geocoder = new kakao.maps.services.Geocoder();

        const callback = (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const selectedLoc = { lat: center.getLat(), lng: center.getLng() };
            console.log(result[0]);
            const addr = result[0].address?.address_name;
            const road_addr = result[0].road_address?.address_name;

            if (!addr && !road_addr) {
              alert(`위치를 다시 한 번 확인해주세요.`);
              return reject('No valid address found.');
            }

            resolve(road_addr ? { addr: road_addr, loc: selectedLoc } : { addr: addr, loc: selectedLoc });
          } else {
            console.log(`Callback Error: ${status}`);
            reject(`Callback Error: ${status}`);
          }
        };
        geocoder.coord2Address(center.getLng(), center.getLat(), callback);
      } else {
        console.log(`Kakao Maps services가 로드되지 않았습니다.`);
      }
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      const options = {
        center: new kakao.maps.LatLng(loc.lat, loc.lng),
        level: 1,
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
