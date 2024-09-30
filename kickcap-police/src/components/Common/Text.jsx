import React from 'react';
import styled from 'styled-components';

const s = {
  Text: styled.span`
    width: ${(props) => props.width};
    font-size: ${(props) => props.size || '14px'};
    border-radius: 10px;
    font-weight: ${(props) => props.bold || '500'};
    cursor: ${(props) => props.cursor || 'default'};
    color: ${({ color, theme }) => (color ? theme[color] : theme['textBasic2'])};
    display: ${(props) => props.display};
    margin: ${(props) => props.margin};
    text-align: ${(props) => props.textalian};
  `,
};
const Text = ({ width, bold, size, cursor, color, display, margin, textalian, children }) => {
  return (
    <s.Text
      width={width}
      bold={bold}
      size={size}
      cursor={cursor}
      color={color}
      display={display}
      margin={margin}
      textalian={textalian}
    >
      {children}
    </s.Text>
  );
};

export default Text;
