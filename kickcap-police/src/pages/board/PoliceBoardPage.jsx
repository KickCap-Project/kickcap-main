import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import BoardHeader from '../../components/Board/BoardHeader';
import WeekChart from '../../components/Board/WeekChart';
import RatioChart from '../../components/Board/RatioChart';
import TimeChart from '../../components/Board/TimeChart';
import DayInfo from '../../components/Board/DayInfo';
import CompareInfo from '../../components/Board/CompareInfo';
import { Outlet } from 'react-router';
import { usePageNavHook } from '../../lib/hook/usePageNavHook';
import { usePageTypeHook } from '../../lib/hook/usePageTypeHook';
import { useModalExitHook } from '../../lib/hook/useModalExitHook';
import { useSearchParams } from 'react-router-dom';
import { getBottomData, gettest, getWeekData } from '../../lib/api/board-api';
import moment from 'moment';
import { useQuery } from '@tanstack/react-query';
import sound from '../../asset/accidentSound.mp3';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { modalActions, selectIsEmergency } from '../../store/modal';
import BoardEmergencyModal from '../../components/Modal/BoardEmergencyModal';
import { getEmergency } from '../../lib/api/main-api';

const s = {
  Container: styled.div`
    padding: 60px 10px 10px 10px;
    height: 100%;
    background-color: #1c1c25;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  MainArea: styled.div`
    width: 100%;
    height: 84%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  `,
  MapArea: styled.div`
    width: 48%;
    height: 100%;
    display: flex;
    align-items: center;
  `,
  DataArea: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
  `,
  ChartArea1: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  `,
  ChartArea2: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  `,
  FooterArea: styled.div`
    width: 100%;
    height: 15%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

const PoliceBoardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sido, setSido] = useState(searchParams.get('sido'));
  const [gugun, setGugun] = useState(searchParams.get('gugun'));

  const {
    data: weekData = {},
    error: weekDataError,
    refetch: refetchWeekData,
  } = useQuery({
    queryKey: ['weekData', sido, gugun],
    queryFn: () => {
      return getWeekData(sido, gugun);
    },
    enabled: false,
  });

  if (weekDataError) {
    alert('데이터를 불러오는 도중 에러가 발생했습니다.');
  }

  const {
    data: bottomData = {},
    error: bottomDataError,
    refetch: refetchBottomData,
  } = useQuery({
    queryKey: ['bottomData', sido, gugun],
    queryFn: () => getBottomData(sido, gugun),
    refetchInterval: 10800000,
  });

  if (bottomDataError) {
    alert('데이터를 불러오는 도중 에러가 발생했습니다.');
  }

  useEffect(() => {
    const newSido = searchParams.get('sido');
    const newGugun = searchParams.get('gugun');

    if (newSido !== sido) {
      setSido(newSido);
    }
    if (newGugun !== gugun) {
      setGugun(newGugun);
    }
    refetchWeekData();
    refetchBottomData();
  }, [searchParams, sido, gugun, refetchWeekData, refetchBottomData]);

  const ButtomFunc = useCallback((today, yesterday) => {
    if (today === yesterday) {
      return 0;
    }
    if (yesterday === 0) {
      return 100;
    }
    if (today < yesterday) {
      return -(1 - today / yesterday) * 100;
    }
    if (today > yesterday) {
      return (today / yesterday - 1) * 100;
    }
  }, []);

  const crackLabel = ['안전모 미착용', '다인 승차'];
  const reportLabel = ['불법 주차', '안전모 미착용', '다인 승차', '보도 주행', '지정차로 위반'];

  const dates =
    weekData.dayTotalResponses && weekData.dayTotalResponses.map((item) => moment(item.date).format('MM-DD'));
  const crack = weekData.dayTotalResponses && weekData.dayTotalResponses.map((item) => item.crackDown);
  const report = weekData.dayTotalResponses && weekData.dayTotalResponses.map((item) => item.report);
  const accident = weekData.dayTotalResponses && weekData.dayTotalResponses.map((item) => item.accident);
  const crackData = [
    (weekData.noHead / (weekData.noHead + weekData.peoples)) * 100,
    (weekData.peoples / (weekData.noHead + weekData.peoples)) * 100,
  ];
  const reportData = [
    (weekData.p / (weekData.p + weekData.n + weekData.h + weekData.d + weekData.w)) * 100,
    (weekData.n / (weekData.p + weekData.n + weekData.h + weekData.d + weekData.w)) * 100,
    (weekData.h / (weekData.p + weekData.n + weekData.h + weekData.d + weekData.w)) * 100,
    (weekData.d / (weekData.p + weekData.n + weekData.h + weekData.d + weekData.w)) * 100,
    (weekData.w / (weekData.p + weekData.n + weekData.h + weekData.d + weekData.w)) * 100,
  ];
  const crackdata = weekData.timeCrackdownResponses && weekData.timeCrackdownResponses.map((item) => item.crackDown);
  const times =
    weekData.timeCrackdownResponses &&
    weekData.timeCrackdownResponses.map((item) => {
      return item.timeIndex === 0
        ? ' 0-2'
        : item.timeIndex === 1
        ? '3-5'
        : item.timeIndex === 2
        ? '6-8'
        : item.timeIndex === 3
        ? '9-11'
        : item.timeIndex === 4
        ? '12-14'
        : item.timeIndex === 5
        ? '15-17'
        : item.timeIndex === 6
        ? '18-20'
        : '21-23';
    });

  const cCrack = ButtomFunc(bottomData.tcrack, bottomData.ycrack).toFixed(1);
  const cReport = ButtomFunc(bottomData.treport, bottomData.yreport).toFixed(1);
  const cAccident = ButtomFunc(bottomData.taccident, bottomData.yaccident).toFixed(1);

  usePageNavHook('board');
  usePageTypeHook('board');
  useModalExitHook();

  //

  const audioRef = useRef(null);
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
    enabled: !isEmergency,
    refetchInterval: isEmergency ? false : 5000,
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
    }
  }, [emergencyData.status, isEmergency]);

  return (
    <>
      <BoardHeader />
      <s.Container>
        <s.MainArea>
          <s.MapArea>
            <Outlet context={{ setSido, setGugun, searchParams, setSearchParams }} />
          </s.MapArea>
          <s.DataArea>
            <s.ChartArea1>
              <WeekChart title={'최근 1주일 단속 수'} datas={crack} labels={dates} />
              <WeekChart title={'최근 1주일 신고 수'} datas={report} labels={dates} />
              <WeekChart title={'최근 1주일 사고 수'} datas={accident} labels={dates} />
            </s.ChartArea1>
            <s.ChartArea2>
              <RatioChart title={'단속 비율'} datas={crackData} labels={crackLabel} />
              <RatioChart title={'신고 비율'} datas={reportData} labels={reportLabel} />
              <TimeChart title={'시간대 별 단속 수'} datas={crackdata} labels={times} />
            </s.ChartArea2>
          </s.DataArea>
        </s.MainArea>
        <s.FooterArea>
          <DayInfo
            title="일일 단속"
            data={bottomData.tcrack && bottomData.tcrack.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
          <DayInfo
            title="일일 신고"
            data={bottomData.treport && bottomData.treport.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
          <DayInfo
            title="일일 사고"
            data={bottomData.taccident && bottomData.taccident.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
          <CompareInfo title={'전일 대비 단속'} data={cCrack} />
          <CompareInfo title={'전일 대비 신고'} data={cReport} />
          <CompareInfo title={'전일 대비 사고'} data={cAccident} />
        </s.FooterArea>
        {emergencyData.data !== undefined && (
          <BoardEmergencyModal open={isEmergency} toggleModal={handleOpenEmergency} data={emergencyData.data} />
        )}
        <audio ref={audioRef} src={sound} />
      </s.Container>
    </>
  );
};

export default PoliceBoardPage;
