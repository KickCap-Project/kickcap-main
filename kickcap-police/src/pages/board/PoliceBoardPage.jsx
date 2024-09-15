import React from 'react';
import styled from 'styled-components';
import BoardHeader from '../../components/Board/BoardHeader';
import WeekChart from '../../components/Board/WeekChart';
import RatioChart from '../../components/Board/RatioChart';
import TimeChart from '../../components/Board/TimeChart';
import DayInfo from '../../components/Board/DayInfo';
import CompareInfo from '../../components/Board/CompareInfo';
import BoardCameraModal from '../../components/Modal/BoardCameraModal';

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
    border: 1px solid red;
    height: 84%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  `,
  MapArea: styled.div`
    width: 48%;
    height: 100%;
    border: 1px solid white;
  `,
  DataArea: styled.div`
    width: 50%;
    height: 100%;
    border: 1px solid white;
    display: flex;
  `,
  ChartArea1: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border: 1px solid aliceblue;
  `,
  ChartArea2: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border: 1px solid aliceblue;
  `,
  FooterArea: styled.div`
    width: 100%;
    height: 15%;
    border: 3px solid yellow;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

const PoliceBoardPage = () => {
  const datas = ['200', '100', '300', '500', '100', '400', '900'];
  const labels = ['09.01', '09.02', '09.03', '09.04', '09.05', '09.06', '09.07'];
  const crackLabel = ['안전모 미착용', '다인 승차'];
  const crackData = ['59.1', '40.9'];
  const reportLabel = ['불법 주차', '안전모 미착용', '다인 승차', '보도 주행', '지정차로 위반'];
  const reportData = ['50', '10', '15', '5', '20'];
  return (
    <>
      <BoardHeader />
      <s.Container>
        <s.MainArea>
          <s.MapArea></s.MapArea>
          <s.DataArea>
            <s.ChartArea1>
              <WeekChart title={'최근 1주일 단속 수'} datas={datas} labels={labels} />
              <WeekChart title={'최근 1주일 신고 수'} datas={datas} labels={labels} />
              <WeekChart title={'최근 1주일 사고 수'} datas={datas} labels={labels} />
            </s.ChartArea1>
            <s.ChartArea2>
              <RatioChart title={'단속 비율'} datas={crackData} labels={crackLabel} />
              <RatioChart title={'신고 비율'} datas={reportData} labels={reportLabel} />
              <TimeChart title={'시간대 별 단속 수'} datas={datas} labels={labels} />
            </s.ChartArea2>
          </s.DataArea>
        </s.MainArea>
        <s.FooterArea>
          <DayInfo title="일일 단속" data={'2,000'} />
          <DayInfo title="일일 신고" data={'20,000'} />
          <DayInfo title="일일 이의제기" data={'2,000'} />
          <CompareInfo title={'전일 대비 단속'} data={'30.2'} />
          <CompareInfo title={'전일 대비 신고'} data={'-35.2'} />
          <CompareInfo title={'전일 대비 이의'} data={'2.4'} />
        </s.FooterArea>
        <BoardCameraModal open={true} />
      </s.Container>
    </>
  );
};

export default PoliceBoardPage;
