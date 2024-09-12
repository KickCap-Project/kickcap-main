import React from 'react';
import styled from 'styled-components';

const area = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 2px, rgba(0, 0, 0, 0.3) 0px 3px 3px;
  display: flex;
  justify-content: space-around;
`;

const s = {
  OnArea: styled(area)`
    background-color: ${(props) => props.theme.AreaColor};
  `,
  OffArea: styled(area)`
    background-color: ${(props) => props.theme.btnOff};
  `,
};

const BasicArea = ({ type, width, height, margin, children }) => {
  return (
    <>
      {' '}
      {type === 'On' ? (
        <s.OnArea width={width} height={height} margin={margin}>
          {children}
        </s.OnArea>
      ) : (
        <s.OffArea width={width} height={height} margin={margin}>
          {children}
        </s.OffArea>
      )}
    </>
  );
};

export default BasicArea;
