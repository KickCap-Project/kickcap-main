import React from 'react';
import styled from 'styled-components';
import BarChart from './Chart/BarChart';

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

const TimeChart = ({ title, datas, labels }) => {
  return (
    <s.Container>
      <BarChart title={title} datas={datas} labels={labels} />
    </s.Container>
  );
};

export default TimeChart;
