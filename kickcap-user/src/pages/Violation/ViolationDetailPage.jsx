import React, { useEffect } from 'react';
import styled from 'styled-components';

import Button from '../../components/Common/Button';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ViolationDetail from '../../components/Violation/ViolationDetail';
import { useLocation, useNavigate } from 'react-router';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  BillWrapper: styled.div`
    width: 90%;
    height: fit-content;
    background-color: ${(props) => props.theme.AreaColor};
    border-radius: 1rem;
    box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  ImgWrapper: styled.img`
    border: 1px solid black;
    width: 80%;
    height: 250px;
    margin-top: 0.5rem;
  `,
  ButtonWrapper: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    gap: 10%;
  `,
};

const ViolationDetailPage = () => {
  // dummy data
  const detail = {
    idx: 1,
    kickBoard: '000-P0000',
    date: '2024-08-03 오후 12:12:12',
    place: '대전시 유성구 학하대로',
    type: 3,
    demerit: 3,
    money: 20000,
    deadLine: '2024-09-02 오후 23:59:59',
    police: '대전 유성 경찰서',
    isFlag: 0,
    isReq: 0,
  };

  const navigate = useNavigate();
  const id = useLocation().state?.idx || null;

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    }
  }, [id]);

  const objectionEventHandler = () => {
    navigate('../objection', { state: { id } });
  };
  const paymentEventHandler = () => {
    navigate('', { state: { id } });
  };

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />
      <s.MainArea>
        <s.BillWrapper>
          <s.ImgWrapper></s.ImgWrapper>
          <ViolationDetail detail={detail} />
          <s.ButtonWrapper>
            {detail.isReq === 0 ? (
              <Button
                width={'120px'}
                height={'30px'}
                size={'0.75rem'}
                bold={'700'}
                onClick={() => objectionEventHandler()}
              >
                이의 제기
              </Button>
            ) : (
              <Button type={'sub'} width={'120px'} height={'30px'} size={'0.75rem'} bold={'700'}>
                이의 제기
              </Button>
            )}
            <Button width={'120px'} height={'30px'} size={'0.75rem'} bold={'700'} onClick={() => paymentEventHandler()}>
              납부하기
            </Button>
          </s.ButtonWrapper>
        </s.BillWrapper>
      </s.MainArea>

      <Footer />
    </s.Container>
  );
};

export default ViolationDetailPage;
