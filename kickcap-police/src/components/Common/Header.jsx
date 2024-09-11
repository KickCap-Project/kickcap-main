import React from 'react';
import styled from 'styled-components';
import Text from './Text';
import { ReactComponent as logo } from '../../asset/svg/logo.svg';
import IconSvg from './IconSvg';

const s = {
  Container: styled.header`
    height: 180px;
    border: 3px solid red;
  `,
  fixedArea: styled.div`
    width: 100%;
    height: 50px;
    position: fixed;
    background-color: ${(props) => props.theme.textBasic};
  `,
  topArea: styled.div`
    height: 100%;
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 15px;
  `,
  mainArea: styled.div`
    height: 130px;
    border: 1px solid green;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  `,
  TitleArea: styled.div`
    width: 30%;
    border: 1px solid black;
    display: flex;
    justify-content: start;
    align-content: center;
  `,
  Title: styled.div`
    font-weight: 700;
    size: 15px;
    color: ${(props) => props.theme.textBasic2};
    display: flex;
    align-items: center;
  `,
  NavArea: styled.div`
    width: 60%;
    border: 1px solid gray;
    display: flex;
    justify-content: space-around;
    align-content: center;
  `,
  Nav: styled.div`
    width: 120px;
    text-align: center;
    size: 15px;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid black;
  `,
};

const Header = ({ title, subTitle }) => {
  return (
    <s.Container>
      <s.fixedArea>
        <s.topArea>
          <s.TitleArea>
            <IconSvg Ico={logo} width={'30px'} margin={'0 15px 0 0'} />
            <s.Title>킥보드 자동화 단속 플랫폼</s.Title>
          </s.TitleArea>
          <s.NavArea>
            <s.Nav>현황 지도</s.Nav>
            <s.Nav>단속 리스트</s.Nav>
            <s.Nav>국민 제보함</s.Nav>
            <s.Nav>이의 제기</s.Nav>
          </s.NavArea>
        </s.topArea>
      </s.fixedArea>
      <s.mainArea>
        <Text
          children={title}
          textalian={'center'}
          margin={'0 auto 20px'}
          display={'block'}
          size={'50px'}
          bold={'700'}
          color={'textBasic2'}
        />
        <Text
          children={subTitle}
          textalian={'center'}
          margin={'0 auto'}
          display={'block'}
          size={'15px'}
          bold={'500'}
          color={'textBasic2'}
        />
      </s.mainArea>
    </s.Container>
  );
};

export default Header;
