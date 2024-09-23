import React from 'react';
import styled from 'styled-components';

const s = {
  Button: styled.div`
    width: 100%;
    height: 10rem;
    border: 1px solid #d3d3d3;
    margin-top: 3vh;
    border-radius: 0.75rem;
    position: relative;
    background-color: ${(props) => props.theme.AreaColor};
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  `,
  Title: styled.div`
    font-size: 1.5rem;
    font-weight: 800;
    position: absolute;
    top: 10%;
    right: 5%;
    letter-spacing: -0.15rem;
  `,
  Description: styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    position: absolute;
    top: 3rem;
    right: 5%;
    letter-spacing: -0.075rem;
  `,
  Img: styled.img`
    position: absolute;
    left: 5%;
    bottom: 0.5rem;
  `,
};

const MainButton = ({ title, description, imgSrc, onClick }) => {
  return (
    <s.Button onClick={onClick}>
      <s.Img src={imgSrc} />
      <s.Title>{title}</s.Title>
      <s.Description>{description}</s.Description>
    </s.Button>
  );
};

export default MainButton;
