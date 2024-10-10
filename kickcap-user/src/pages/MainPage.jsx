import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import HeaderMain from './../components/HeaderMain';
import MainButton from './../components/MainButton';
import Carousel from './../components/Carousel';
import Footer from './../components/Footer';

import MainBtn1 from './../asset/img/svg/mainBtn1.svg';
import MainBtn2 from './../asset/img/svg/mainBtn2.svg';
import MainBtn3 from './../asset/img/svg/mainBtn3.svg';
import MainBtn4 from './../asset/img/svg/mainBtn4.svg';
import ChatbotBtn from './../asset/img/svg/chat.svg';
import MainPageModal from '../components/Modal/MainPageModal';
import { modalActions, selectIsInfo, selectIsMain, selectIsPhone } from './../store/modal';
import { useAppDispatch, useAppSelector } from './../lib/hook/useReduxHook';
import PhoneSetModal from '../components/Modal/PhoneSetModal';
import Text from '../components/Common/Text';
import { useNavigate } from 'react-router';
import InfoModal from '../components/Modal/InfoModal';

import { localAxios } from '../util/axios-setting';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  UserInfoArea: styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: end;
    width: 90%;
    margin: 20px auto 10px;
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 80%;
    position: relative;
  `,
  MainThum: styled.div`
    width: 100%;
    margin-bottom: 4%;
  `,
  SmallButtonWrapper: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  ChatbotButton: styled.img`
    position: fixed;
    right: 10px;
    bottom: 10px;
    cursor: pointer;
    width: 50px;
    height: 50px;
    z-index: 1000;

    @media (min-width: 768px) {
      width: 10%; /* 태블릿 화면에서 아이콘 크기 조정 */
      bottom: 10%; /* 아이콘이 Footer에 겹치지 않도록 위치 조정 */
    }

    @media (min-width: 1024px) {
      width: 8%; /* 큰 화면에서는 더 작은 크기로 */
      bottom: 15%; /* 더 넉넉한 공간 확보 */
    }
  `,
};

const MainPage = () => {
  const isMain = useAppSelector(selectIsMain);
  const isPhone = useAppSelector(selectIsPhone);
  const isInfo = useAppSelector(selectIsInfo);
  const dispatch = useAppDispatch();
  const handleOpenMainModal = (isFlag) => {
    dispatch(modalActions.ChangeIsMain(isFlag));
  };
  const handleOpenPhoneModal = (isFlag) => {
    dispatch(modalActions.ChangeIsPhone(isFlag));
  };
  const handleOpenInfoModal = (isFlag) => {
    dispatch(modalActions.ChangeIsInfo(isFlag));
  };

  const navigate = useNavigate();
  const handleMovePage = (path) => {
    navigate(path);
  };

  // const Info = JSON.parse(localStorage.getItem('Info'));
  const [info, setInfo] = useState(JSON.parse(localStorage.getItem('Info')));

  // 메인 페이지로 접속, 혹은 돌아갈 때 demerit 새로 호출해 갱신, 오류 발생 시 기존 벌점으로
  useEffect(() => {
    const setDemerit = async () => {
      const axiosInstance = localAxios();

      const storedInfo = JSON.parse(localStorage.getItem('Info'));

      if (!storedInfo) {
        alert('사용자 정보를 확인해주세요.');
        return;
      }

      try {
        const response = await axiosInstance.get('/members/demerit');

        if (response.status === 200) {
          const updatedInfo = { ...info, demerit: response.data };

          setInfo(updatedInfo);
          localStorage.setItem('Info', JSON.stringify(updatedInfo));
        }
      } catch (err) {
        // console.log(`벌점 조회 중 오류 발생: ${err}`);
      }
    };

    setDemerit();
  }, []);

  return (
    <s.Container>
      <HeaderMain />

      <s.UserInfoArea>
        <Text
          children={info.name + ' 님 벌점 : '}
          bold={'800'}
          color={'textBasic2'}
          size={'20px'}
          margin={'0 5px 0 0'}
        />
        <Text children={info.demerit + ' 점'} bold={'800'} color={'textBasic2'} size={'30px'} />
      </s.UserInfoArea>

      <s.MainArea>
        <MainButton
          type="big"
          title="나의 단속 내역"
          description="내 단속 내역을 한눈에!"
          imgSrc={MainBtn1}
          onClick={() => handleMovePage('/violation')}
        />
        <s.MainThum />
        <MainButton
          type="big"
          title="제보하기"
          description="잡아주세요!"
          imgSrc={MainBtn3}
          onClick={() => handleMovePage('/report')}
        />

        <s.SmallButtonWrapper>
          <MainButton
            type="small"
            title="원 클릭 신고"
            description="긴급 신고를 한번에!"
            imgSrc={MainBtn2}
            onClick={() => handleMovePage('/sos')}
          />
          <MainButton
            type="small"
            title="이의 내역"
            description="검토해주세요!"
            imgSrc={MainBtn4}
            onClick={() => handleMovePage('/objection')}
          />
        </s.SmallButtonWrapper>

        <s.ChatbotButton src={ChatbotBtn} onClick={() => handleMovePage('/chat')} />
      </s.MainArea>

      <Carousel />
      <Footer />
      <PhoneSetModal open={isPhone} toggleModal={handleOpenPhoneModal} />
      <MainPageModal open={isMain} toggleModal={handleOpenMainModal} />
      <InfoModal open={isInfo} toggleModal={handleOpenInfoModal} />
    </s.Container>
  );
};

export default MainPage;
