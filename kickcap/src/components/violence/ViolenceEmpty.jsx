import React from 'react';
import styled from 'styled-components';

import Text from '../Common/Text';

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
    min-width: 250px;
  `,
};

const ViolenceEmpty = () => {
  return (
    <s.Container>
      <s.WatermarkImg src={watermark} />
      <Text>
        <s.Text size={'20px'} bold={'800'}>
          단속 내역이 존재하지 않습니다.
        </s.Text>
      </Text>
    </s.Container>
  );
};

export default ViolenceEmpty;
