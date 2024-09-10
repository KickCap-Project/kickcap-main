import React from 'react';
import styled from 'styled-components';

const s = {
  Button: styled.div`
    width: ${(props) => (props.type === 'big' ? '100%' : '49%')};
    height: ${(props) => (props.type === 'big' ? '5rem' : '6rem')};
    border: 1px solid #d3d3d3;
    margin-top: 2%;
    border-radius: 1rem;
    position: relative;
    background-color: ${(props) => props.theme.AreaColor};
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
  `,
  Title: styled.div`
    font-size: ${(props) => (props.type === 'big' ? '1.5rem' : '1.25rem')};
    font-weight: 800;
    position: absolute;
    top: 10%;
    right: 5%;
    letter-spacing: -0.15rem;
  `,
  Description: styled.div`
    font-size: ${(props) => (props.type === 'big' ? '0.75rem' : '0.65rem')};
    font-weight: 800;
    position: absolute;
    top: ${(props) => (props.type === 'big' ? '45%' : '35%')};
    right: 5%;
    letter-spacing: -0.075rem;
  `,
  Img: styled.img`
    position: absolute;
    left: 5%;
    top: ${(props) => (props.type === 'big' ? '10%' : '')};
    bottom: ${(props) => (props.type === 'big' ? '' : '10%')};
  `,
};

const MainButton = ({ type, title, description, imgSrc }) => {
  return (
    <s.Button type={type}>
      <s.Img src={imgSrc} type={type} />
      <s.Title type={type}>{title}</s.Title>
      <s.Description type={type}>{description}</s.Description>
    </s.Button>
  );
};

export default MainButton;
