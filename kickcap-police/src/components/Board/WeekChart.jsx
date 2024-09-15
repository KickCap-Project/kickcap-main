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
    border: 1px solid red;
    margin: 0 auto;
  `,
};

const WeekChart = ({ title, datas, labels }) => {
  return (
    <s.Container>
      <Text children={title} size={'13px'} bold={'600'} textalian={'center'} width={'70%'} color={'textBasic'} />
      <LineChart datas={datas} labels={labels} />
    </s.Container>
  );
};

export default WeekChart;
