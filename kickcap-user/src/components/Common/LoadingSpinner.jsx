import React from "react";
import styled, { useTheme } from "styled-components";
import { SyncLoader } from "react-spinners";

const s = {
  Container: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height};
  `,
};

const LoadingSpinner = ({ width, height }) => {
  const theme = useTheme();
  
  return (
    <s.Container width={width} height={height}>
      <SyncLoader color={theme.mainColor} />
    </s.Container>
  );
};

export default LoadingSpinner;