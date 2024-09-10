import React from 'react';
import styled from 'styled-components';

const s = {
  TextArea: styled.textarea`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    background-color: ${(props) => props.theme.WriteInput};
    color: ${(props) => props.theme.textColor};
    font-weight: ${(props) => props.bold || '500'};
    font-size: ${(props) => props.size || '15px'};
    display: ${(props) => props.display};
    margin: ${(props) => props.margin};
    outline: none;
    border-radius: 10px;
    border: 1px solid #d3d3d3;
    resize: none;
    padding: 10px;
    &::placeholder {
      color: ${({ placeColor, theme }) => (placeColor ? theme[placeColor] : theme['textColor2'])};
    }
  `,
};

const TextArea = ({
  mode,
  value,
  name,
  width,
  height,
  bold,
  size,
  display,
  margin,
  textalian,
  placeColor,
  placeholder,
  onChange,
  onClick,
  onKeyPress,
}) => {
  return (
    <>
      {mode === 'read' ? (
        <s.TextArea
          width={width}
          height={height}
          bold={bold}
          size={size}
          margin={margin}
          display={display}
          textalian={textalian}
          placeColor={placeColor}
          placeholder={placeholder}
          name={name}
          value={value}
          readOnly
        />
      ) : (
        <s.TextArea
          width={width}
          height={height}
          bold={bold}
          size={size}
          margin={margin}
          display={display}
          textalian={textalian}
          placeColor={placeColor}
          placeholder={placeholder}
          name={name}
          value={value}
          onClick={onClick}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      )}
    </>
  );
};
export default TextArea;
