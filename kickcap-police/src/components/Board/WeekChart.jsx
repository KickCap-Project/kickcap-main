import React from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';
import LineChart from './Chart/LineChart';

const s = {
  Container: styled.div`
    background-color: ${(props) => props.theme.dark};
    border-radius: 10px;
    width: 95%;
    height: 32%;
    margin: 0 auto;
    padding: 10px;
  `,
};

const WeekChart = ({ title, datas, labels }) => {
  return (
    <s.Container>
      <LineChart title={title} datas={datas} labels={labels} />
    </s.Container>
  );
};

export default WeekChart;
