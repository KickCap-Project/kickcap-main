import React, { useEffect, useState } from 'react';
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
import { chart1, chart2, etc, bottomData } from '../../lib/data/ChartData';
import { useSearchParams } from 'react-router-dom';

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

  useEffect(() => {
    console.log(searchParams.get('sido'));
    console.log(searchParams.get('gugun'));
  }, [searchParams]);

  const crackLabel = ['안전모 미착용', '다인 승차'];
  const reportLabel = ['불법 주차', '안전모 미착용', '다인 승차', '보도 주행', '지정차로 위반'];

  const dates = chart1.map((item) => item.date);
  const crack = chart1.map((item) => item.crackDown);
  const report = chart1.map((item) => item.report);
  const accident = chart1.map((item) => item.accident);
  const crackdata = chart2.map((item) => item.crackDown);
  const crackData = [(etc.noHead / (etc.noHead + etc.peoples)) * 100, (etc.peoples / (etc.noHead + etc.peoples)) * 100];
  const reportData = [
    (etc.p / (etc.p + etc.n + etc.h + etc.d + etc.w)) * 100,
    (etc.n / (etc.p + etc.n + etc.h + etc.d + etc.w)) * 100,
    (etc.h / (etc.p + etc.n + etc.h + etc.d + etc.w)) * 100,
    (etc.d / (etc.p + etc.n + etc.h + etc.d + etc.w)) * 100,
    (etc.w / (etc.p + etc.n + etc.h + etc.d + etc.w)) * 100,
  ];

  const cCrack = ((bottomData.tCrack - bottomData.yCrack) / bottomData.yCrack) * 100;
  const cReport = ((bottomData.tReport - bottomData.yReport) / bottomData.yReport) * 100;
  const cAccident = ((bottomData.tAccident - bottomData.yAccident) / bottomData.yAccident) * 100;

  const times = chart2.map((item) => {
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

  usePageNavHook('board');
  usePageTypeHook('board');
  useModalExitHook();
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
          <DayInfo title="일일 단속" data={bottomData.tCrack.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          <DayInfo title="일일 신고" data={bottomData.tReport.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          <DayInfo title="일일 사고" data={bottomData.tAccident.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
          <CompareInfo title={'전일 대비 단속'} data={cCrack.toFixed(1)} />
          <CompareInfo title={'전일 대비 신고'} data={cReport.toFixed(1)} />
          <CompareInfo title={'전일 대비 사고'} data={cAccident.toFixed(1)} />
        </s.FooterArea>
      </s.Container>
    </>
  );
};

export default PoliceBoardPage;
