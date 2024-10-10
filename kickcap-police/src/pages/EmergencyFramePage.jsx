import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router';

const s = {
  Container: styled.div`
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background-color: ${(props) => props.theme.bgColor};
  `,
};
const EmergencyPage = () => {
  return (
    <s.Container>
      <Outlet />
    </s.Container>
  );
};

export default EmergencyPage;
