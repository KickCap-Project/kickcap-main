import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Button from '../../components/Common/Button';
import EduVideo from '../../components/Violation/EduVideo';

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
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
    overflow: auto;
  `,
  VideoArea: styled.div`
    width: 95%;
    margin: 0px auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  TextArea: styled.div`
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    cursor: default;
  `,
  BtnARea: styled.div`
    width: 90%;
  `,
};

const ViolationEducationPage = () => {
  const navigate = useNavigate();
  const id = useLocation().state?.id || null;
  const name = useLocation().state?.name || null;
  const pay = useLocation().state?.pay || null;

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    }
  }, [id]);

  const [played, setPlayed] = useState(true);
  const description =
    '벌점 기준을 초과하여 교육 영상을 수강하셔야 합니다.\n영상 재생 완료 후 납부를 진행해주세요.\n\n10점 단위 초과 시 교육 이수 필수';

  const paymentEventHandler = () => {
    onClickPayment();
  };

  const onClickPayment = () => {
    const { IMP } = window;
    IMP.init(process.env.REACT_APP_IMPORT);

    const data = {
      pg: 'nice', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 100, // 결제금액
      name: '킥보드 범칙금', // 상품명
      buyer_name: name, // 구매자 이름
      m_redirect_url: `https://www.bardisue.store/violation/payment/success/${id}`,
    };

    IMP.request_pay(data, callback);
  };

  const callback = async (response) => {
    const { success, merchant_uid, error_msg } = response;
    if (success) {
      navigate(`/violation/payment/success/${id}`);
      // await postBillPay(
      //   id,
      //   1,
      //   (resp) => {
      //     alert('정상 납부되었습니다.');
      //     navigate('/violation/payment/success');
      //   },
      //   (error) => {
      //     alert('납부 중 오류가 발생했습니다. 관할 경찰서에 문의하시기 바랍니다.');
      //     navigate('/main');
      //   },
      // );
    } else {
      alert(`납부가 취소되었습니다. 잠시 후 다시 시도해주세요.`);
      navigate(-1);
    }
  };

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />
      <s.MainArea>
        <s.VideoArea>
          <EduVideo onFinish={setPlayed} />
        </s.VideoArea>
        <s.VideoArea>
          <s.TextArea>{description}</s.TextArea>
        </s.VideoArea>
      </s.MainArea>
      <s.BtnARea>
        <Button
          type={played ? '' : 'sub'}
          width={'100%'}
          height={'40px'}
          display={'block'}
          margin={'20px auto'}
          onClick={played ? paymentEventHandler : null}
        >
          납부하기
        </Button>
      </s.BtnARea>
      <Footer />
    </s.Container>
  );
};

export default ViolationEducationPage;
