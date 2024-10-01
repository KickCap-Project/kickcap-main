import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '../../components/Common/Button';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ViolationDetail from '../../components/Violation/ViolationDetail';
import { getBillDetail, getImgFile } from '../../lib/api/violation-api';
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
};

const ViolationDetailPage = () => {
  const [detail, setDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);

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
    // 벌점 10점 이상일 때 education으로, 아니면 payment로 연결
    const demerit = JSON.parse(localStorage.getItem('Info')).demerit || null;

    if (demerit === null) {
      navigate('*');
      return;
    }

    if (demerit >= 10) {
      navigate('../payment/education', { state: { id }});
    } else {
      navigate('../payment', { state: { id } });
    }
  };

  useEffect(() => {
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
          <s.ImgWrapper src={imgFile} alt="image" />
          <ViolationDetail detail={detail} />
          <s.ButtonWrapper>
            {detail.isObjection === 0 ? (
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
