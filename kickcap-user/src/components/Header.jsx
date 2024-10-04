import React from 'react';
import styled from 'styled-components';
import Text from './Common/Text';
import BackSvg from './../asset/img/svg/back.svg';
import { useNavigate } from 'react-router';

const s = {
  HeaderArea: styled.div`
    width: 100%;
    height: 7vh;
    min-height: 50px;
    border-bottom: 1px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  Img: styled.img`
    position: absolute;
    left: 5%;
    cursor: pointer;
  `,
};

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1); // 이전 페이지가 있으면 뒤로가기
    } else {
      navigate('/main'); // 이전 페이지가 히스토리 스택에 없으면 메인 페이지로 이동 (ex. 푸시 알림을 눌러 알림 목록 페이지로 이동 시)
    }
  };

  return (
    <s.HeaderArea>
      <s.Img src={BackSvg} onClick={handleBackClick} />
      <Text size={20} bold={'800'}>
        {title}
      </Text>
    </s.HeaderArea>
  );
};

export default Header;
