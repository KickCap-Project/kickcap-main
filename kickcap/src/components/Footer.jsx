import React from 'react';
import styled from 'styled-components';
import Text from './Common/Text';

const s = {
  FooterArea: styled.div`
    width: 100%;
    border-top: 1px solid #d3d3d3;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: ${(props) => props.theme.AreaColor};
  `,
};

const Footer = () => {
  return (
    <s.FooterArea>
      <Text size={'15px'} bold={'800'} color="mainColor">
        안전한 킥보드 이용
      </Text>
      <Text size={'15px'} bold={'800'} color="mainColor">
        KickCap
      </Text>
      <Text size={'8px'} color="mainColor">
        <br />
        <br />ⓒ 2024. KickCap All rights reserved.
      </Text>
    </s.FooterArea>
  );
};

export default Footer;
