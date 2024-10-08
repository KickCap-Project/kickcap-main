import React from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';

const s = {
  Container: styled.div`
    height: 100vh;
    position: relative;
    margin: 0 auto;
    background-color: ${(props) => props.theme.bgColor};
    overflow: auto;
  `,
};

const BasicPage = () => {
  return (
    <s.Container>
      <Outlet />
    </s.Container>
  );
};

export default BasicPage;
