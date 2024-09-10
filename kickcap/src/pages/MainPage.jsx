import React from 'react';
import styled from 'styled-components';
import Text from '../components/Common/Text';

import HeaderMain from '../components/HeaderMain';
import MainButton from '../components/MainButton';
import Footer from './../components/Footer';

import MainBtn1 from './../asset/img/svg/mainBtn1.svg';
import MainBtn2 from './../asset/img/svg/mainBtn2.svg';
import MainBtn3 from './../asset/img/svg/mainBtn3.svg';
import MainBtn4 from './../asset/img/svg/mainBtn4.svg';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  UserInfoArea: styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: end;
    width: 90%;
    margin-top: 1.5rem;
  `,
  UserInfoText: styled.div`
    font-size: ${(props) => (props.type === 'demerit' ? '1.5rem' : '1.2rem')};
    font-weight: 800;
    letter-spacing: ${(props) => (props.type === 'demerit' ? '-0.15rem' : '-0.12rem')};
    margin-right: ${(props) => (props.type === 'demerit' ? '' : '0.85rem')};
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    position: relative;
  `,
  SmallButtonWrapper: styled.div`
    display: flex;
    justify-content: space-between;
  `,
};

const MainPage = () => {
  const username = '오진영';
  const demerit = 0;

  return (
    <s.Container>
      <HeaderMain />

      <s.UserInfoArea>
        <s.UserInfoText type="name" size={'1.2rem'} bold={'800'}>
          {username}님 벌점 :
        </s.UserInfoText>
        <s.UserInfoText type="demerit" size={'1.5rem'} bold={'800'}>
          {demerit} 점
        </s.UserInfoText>
      </s.UserInfoArea>

      <s.MainArea>
        <MainButton type="big" title="나의 단속 내역" description="내 단속 내역을 한눈에!" imgSrc={MainBtn1} />
        <MainButton type="big" title="원 클릭 신고" description="긴급 신고를 한번에!" imgSrc={MainBtn2} />

        <s.SmallButtonWrapper>
          <MainButton type="small" title="제보하기" description="잡아주세요!" imgSrc={MainBtn3} />
          <MainButton type="small" title="이의 내역" description="검토해주세요!" imgSrc={MainBtn4} />
        </s.SmallButtonWrapper>
      </s.MainArea>

      <Footer />
    </s.Container>
  );
};

export default MainPage;
