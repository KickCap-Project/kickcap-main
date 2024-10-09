import React, { useEffect, useRef } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import BoardEmergencyModal from '../components/Modal/BoardEmergencyModal';
import { modalActions, selectIsEmergency } from '../store/modal';
import { useAppDispatch, useAppSelector } from '../lib/hook/useReduxHook';
import { getEmergency } from '../lib/api/main-api';
import { Outlet } from 'react-router';
import sound from '../asset/accidentSound.mp3';

const s = {
  Container: styled.div`
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
};
const EmergencyPage = () => {
  const audioRef = useRef(null); // Create a ref for the audio element
  const isEmergency = useAppSelector(selectIsEmergency);
  const dispatch = useAppDispatch();
  const handleOpenEmergency = (isFlag) => {
    dispatch(modalActions.ChangeIsEmergency(isFlag));
    if (!isFlag) {
      refetchEmergencyData();
    }
  };

  const {
    data: emergencyData = {},
    refetch: refetchEmergencyData,
    status,
  } = useQuery({
    queryKey: ['emergencyData'],
    queryFn: () => {
      return getEmergency();
    },
    enabled: !isEmergency, // 모달이 열려있으면 쿼리 비활성화
    refetchInterval: isEmergency ? false : 10000, // 모달이 열려있으면 10초마다 쿼리 비활성화
  });
  useEffect(() => {
    if (emergencyData.status === 200) {
      handleOpenEmergency(true);
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.loop = true;
      }
    } else if (emergencyData.status === 204) {
      handleOpenEmergency(false);
      refetchEmergencyData();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log('없어 다음으로 추적');
    }
  }, [emergencyData.status, isEmergency]);
  return (
    <s.Container>
      <Outlet />
      {emergencyData.data !== undefined && (
        <BoardEmergencyModal open={isEmergency} toggleModal={handleOpenEmergency} data={emergencyData.data} />
      )}
      <audio ref={audioRef} src={sound} />
    </s.Container>
  );
};

export default EmergencyPage;
