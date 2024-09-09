import React from 'react';
import styled from 'styled-components';

const btn = styled.button`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  font-weight: ${(props) => props.bold || 700};
  font-size: ${(props) => props.size || '20px'};
  border-radius: 10px;
  margin: ${(props) => props.margin};
  display: ${(props) => props.display};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 2px, rgba(0, 0, 0, 0.3) 0px 3px 3px;
`;
const s = {
  Mainbutton: styled(btn)`
    background-color: ${(props) => props.theme.mainColor};
    color: ${(props) => props.theme.btnText};
  `,
  Subbutton: styled(btn)`
    background-color: ${(props) => props.theme.btnOff};
    color: ${(props) => props.theme.textBasic};
  `,
};
const Button = ({ type, width, height, bold, size, margin, display, onClick, children }) => {
  return (
    <>
      {type !== 'sub' ? (
        <s.Mainbutton
          width={width}
          height={height}
          bold={bold}
          size={size}
          margin={margin}
          display={display}
          onClick={onClick}
        >
          {children}
        </s.Mainbutton>
      ) : (
        <s.Subbutton
          width={width}
          height={height}
          bold={bold}
          size={size}
          margin={margin}
          display={display}
          onClick={onClick}
        >
          {children}
        </s.Subbutton>
      )}
    </>
  );
};

export default Button;
