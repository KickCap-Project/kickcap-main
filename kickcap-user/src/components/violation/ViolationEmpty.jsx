import React from 'react';
import styled from 'styled-components';

import watermark from './../../asset/img/svg/waterMark.svg';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  WatermarkImg: styled.img`
    width: 80%;
    min-width: 300px;
    height: auto;
    position: relative;
    z-index: 1;
  `,
  Text: styled.div`
    font-size: 20px;
    font-weight: 800;
    min-width: 250px;
  `,
};

const ViolationEmpty = () => {
  return (
    <s.Container>
      <s.WatermarkImg src={watermark} />
      <s.Text>단속 내역이 존재하지 않습니다.</s.Text>
    </s.Container>
  );
};

export default ViolationEmpty;
