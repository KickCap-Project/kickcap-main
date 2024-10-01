import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useLocation, useNavigate } from 'react-router';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { postBillPay } from '../../lib/api/violation-api';

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
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
    overflow: auto;
  `,
  Description: styled.div`
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: -0.05rem;
    white-space: pre-line;
    margin-bottom: 40px;
    line-height: 20px;
    cursor: default;
  `,
};

const ViolationPaymentPage = () => {
  const navigate = useNavigate();
  const id = useLocation().state?.id || null;
  const name = useLocation().state?.name || null;
  const pay = useLocation().state?.pay || null;

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    } else {
      onClickPayment();
    }
  }, [id, name, pay]);

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init(process.env.REACT_APP_IMPORT);

    const data = {
      pg: 'nice', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: pay, // 결제금액
      name: '킥보드 범칙금', // 상품명
      buyer_name: name, // 구매자 이름
    };

    IMP.request_pay(data, callback);
  };

  const callback = async (response) => {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      await postBillPay(
        id,
        0,
        (resp) => {
          alert('정상 납부되었습니다.');
          navigate('../../main');
        },
        (error) => {
          alert('납부 중 오류가 발생했습니다. 관할 경찰서에 문의하시기 바랍니다.');
          navigate('../../main');
        },
      );
    } else {
      alert(`납부가 취소되었습니다. 잠시 후 다시 시도해주세요.`);
      navigate(-1);
    }
  };

  return (
    <s.Container>
      <Header title={'범칙금 납부'} />
      <s.MainArea>
        <s.Description>납부 중 입니다. 잠시만 기다려주세요.</s.Description>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ViolationPaymentPage;
