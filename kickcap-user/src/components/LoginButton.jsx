import React from 'react';
import styled from 'styled-components';

const s = {
  LoginBtn: styled.div`
    border: ${(props) => (props.bgcolor === '#FFFFFF' ? '1px solid #d3d3d3' : '')};
    height: 2rem;
    width: 85%;
    border-radius: 0.5rem;
    color: ${(props) => props.color};
    background-color: ${(props) => props.bgcolor};
    position: relative;
    margin-bottom: 0.6rem;
    cursor: pointer;
  `,
  Logo: styled.img`
    position: absolute;
    top: 50%;
    left: 10%;
    transform: translateY(-50%);
  `,
  Text: styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: -0.05rem;
    transform: translateX(-50%) translateY(-50%);
  `,
};

const LoginButton = ({ title, imgSrc, color, bgcolor, onClick }) => {
  return (
    <s.LoginBtn color={color} bgcolor={bgcolor} onClick={onClick}>
      <s.Logo src={imgSrc} />
      <s.Text>{title}</s.Text>
    </s.LoginBtn>
  );
};

export default LoginButton;
