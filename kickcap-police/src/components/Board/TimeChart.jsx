import React from 'react';
import styled from 'styled-components';
import Text from '../Common/Text';
import BarChart from './Chart/BarChart';

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

const TimeChart = ({ title, datas, labels }) => {
  return (
    <s.Container>
      <Text
        children={title}
        size={'13px'}
        bold={'600'}
        textalian={'center'}
        width={'120px'}
        color={'textBasic'}
        display={'block'}
      />
      <BarChart datas={datas} labels={labels} />
    </s.Container>
  );
};

export default TimeChart;
