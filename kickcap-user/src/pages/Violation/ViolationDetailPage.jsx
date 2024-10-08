import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Text from '../../components/Common/Text';
import Button from '../../components/Common/Button';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ViolationDetail from '../../components/Violation/ViolationDetail';
import { getBillDetail, getImgFile } from '../../lib/api/violation-api';
import { useLocation, useNavigate } from 'react-router';
import { localAxios } from '../../util/axios-setting';

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
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  `,
  ImgWrapper: styled.img`
    border: 1px solid black;
    width: 80%;
    /* height: 250px; */
    max-height: 300px;
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
  LoadingArea: styled.div`
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

const ViolationDetailPage = () => {
  const [detail, setDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [demerit, setDemerit] = useState('');
  const navigate = useNavigate();
  const id = useLocation().state?.idx || null;

  const objectionEventHandler = () => {
    navigate('../objection', { state: { id } });
  };

  const objectionDetailHandler = (e) => {
    if (detail.objectionId && detail.objectionId !== -1) {
      navigate('/objection/detail', { state: { idx: detail.objectionId } });
    } else {
      e.preventDefault();
    }
  };

  const paymentEventHandler = () => {
    // 벌점 10점 이상일 때 education으로, 아니면 payment로 연결
    const info = JSON.parse(localStorage.getItem('Info'));
    const demerit = info ? info.demerit : null;
    const name = info ? info.name : null;

    if (demerit === null) {
      navigate('*');
      return;
    }

    if (demerit >= 10) {
      navigate('../payment/education', { state: { id, name, pay: detail.totalBill } });
    } else {
      navigate('../payment', { state: { id, name, pay: detail.totalBill } });
    }
  };

  const handlePreventDefault = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    }

    const info = JSON.parse(localStorage.getItem('Info'));
    const name = info ? info.name : null;

    const fetchData = async () => {
      if (!isLoading) {
        setIsLoading(true);

        try {
          const detailResponse = await getBillDetail(id);
          if (!detailResponse) {
            navigate(-1);
            return;
          }

          setDetail(detailResponse);
          console.log('세부 항목을 불러오는 데 성공했습니다.');
        } catch (err) {
          console.error(`Error fetching detail data: ${err}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const getDemerit = async () => {
      const axiosInstance = localAxios();
      try {
        const response = await axiosInstance.get('/members/demerit');

        if (response.status === 200) {
          setDemerit(response.data);
          localStorage.setItem('Info', JSON.stringify({ name, demerit: response.data }));
        }
      } catch (err) {
        alert('잠시 후 다시 시도해주세요.');
      }
    };

    getDemerit();
    fetchData();
  }, [id]);

  useEffect(() => {
    // detail.imageSrc가 있을 때만 이미지 불러오기
    const fetchImage = async () => {
      if (detail.imageSrc) {
        try {
          const imgFileResponse = await getImgFile(detail.imageSrc);

          // blob를 이미지 URL로 변환
          const imgFileURL = URL.createObjectURL(imgFileResponse);
          setImgFile(imgFileURL);
        } catch (err) {
          console.error(`Error fetching image data: ${err}`);
        }
      }
    };

    fetchImage();
  }, [detail.imageSrc]);

  return (
    <s.Container>
      <Header title={'나의 단속 내역'} />
      <s.MainArea>
        <s.BillWrapper>
          {imgFile ? <s.ImgWrapper src={imgFile} alt="image" /> : <LoadingSpinner height={'300px'} />}
          <ViolationDetail detail={detail} />
          <s.ButtonWrapper>
            {detail.isFlag === 'PAID' || detail.isFlag === 'CANCEL' ? (
              detail.objectionId && detail.objectionId !== -1 ? (
                // 2-1. PAID, CANCEL 상태고 이의 제기 이력이 있을 경우
                // 이의내역 버튼만 활성화
                <Button
                  width={'120px'}
                  height={'30px'}
                  size={'0.75rem'}
                  bold={'700'}
                  onClick={() => objectionDetailHandler()}
                >
                  이의 내역
                </Button>
              ) : // 2-2. PAID, CANCEL 상태고 이의를 제기한 적이 없을 경우(objectionId === -1)
              // 아무 버튼도 띄우지 않기
              null
            ) : (
              <>
                {detail.response === null ? (
                  // 1-1. UNPAID 상태고 이의를 제기하지 않은 상태인 경우
                  // 이의제기 활성화, 납부하기 활성화
                  <>
                    <Button
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={() => objectionEventHandler()}
                    >
                      이의 제기
                    </Button>
                    <Button
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={() => paymentEventHandler()}
                    >
                      납부하기
                    </Button>
                  </>
                ) : detail.response === 'N' ? (
                  // 1-2-1. UNPAID 상태이고, 이의제기 상태이고, 답변 없는 상태라면
                  // 이의내역 활성화, 납부하기 비활성화
                  <>
                    <Button
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={() => objectionDetailHandler()}
                    >
                      이의 내역
                    </Button>
                    <Button
                      type={'sub'}
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={handlePreventDefault}
                    >
                      납부하기
                    </Button>
                  </>
                ) : (
                  // 1-2-2. UNPAID 상태이고, 이의제기 상태이고, 답변이 달린 상태라면
                  // 이의내역 활성화, 납부하기 활성화
                  <>
                    <Button
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={() => objectionDetailHandler()}
                    >
                      이의 내역
                    </Button>
                    <Button
                      width={'120px'}
                      height={'30px'}
                      size={'0.75rem'}
                      bold={'700'}
                      onClick={() => paymentEventHandler()}
                    >
                      납부하기
                    </Button>
                  </>
                )}
              </>
            )}
          </s.ButtonWrapper>
        </s.BillWrapper>
      </s.MainArea>

      <Footer />
    </s.Container>
  );
};

export default ViolationDetailPage;
