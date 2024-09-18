import React from 'react';
import styled from 'styled-components';

const s = {
  Input: styled.input`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    border: 1px solid #d3d3d3;
    background-color: ${({ InputColor, theme }) => (InputColor ? theme[InputColor] : theme['WriteInput'])};
    color: ${(props) => props.theme.textColor};
    font-weight: ${(props) => props.bold || '500'};
    font-size: ${(props) => props.size || '15px'};
    display: ${(props) => props.display};
    margin: ${(props) => props.margin};
    text-align: ${(props) => props.textalian};
    &::placeholder {
      color: ${({ placeColor, theme }) => (placeColor ? theme[placeColor] : theme['placeholderColor'])};
    }
  `,
};

const Input = ({
  mode,
  type,
  value,
  name,
  id,
  width,
  height,
  bold,
  size,
  display,
  margin,
  textalian,
  placeColor,
  InputColor,
  placeholder,
  onChange,
  onClick,
  onKeyPress,
}) => {
  return (
    <>
      {mode === 'read' ? (
        <s.Input
          type={type}
          value={value}
          name={name}
          id={id}
          width={width}
          height={height}
          bold={bold}
          size={size}
          display={display}
          margin={margin}
          textalian={textalian}
          placeColor={placeColor}
          placeholder={placeholder}
          InputColor={InputColor}
          readOnly
        />
      ) : (
        <s.Input
          type={type}
          value={value}
          name={name}
          id={id}
          width={width}
          height={height}
          bold={bold}
          size={size}
          display={display}
          margin={margin}
          textalian={textalian}
          placeColor={placeColor}
          placeholder={placeholder}
          InputColor={InputColor}
          onClick={onClick}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      )}
    </>
  );
};

export default Input;
