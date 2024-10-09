import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import ObjectionDetailForm from './../../components/Objection/ObjectionDetailForm';

import Header from './../../components/Header';
import Footer from './../../components/Footer';
import { useLocation, useNavigate } from 'react-router';

import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { getObjectionDetail } from '../../lib/api/objection-api';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    flex: 1;
    width: 90%;
    height: 100%;
    padding-top: 6vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-basis: 0;
    overflow: auto;
  `,
};

const ObjectionDetailPage = () => {
  const [objectionDetail, setObjectionDetail] = useState(null);
  const navigate = useNavigate();
  const id = useLocation().state?.idx || sessionStorage.getItem('objectionId') || null;

  const setObj = async (id) => {
    try {
      const response = await getObjectionDetail(id);

      if (response.status === 200) {
        setObjectionDetail(response.data);
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    if (id === null) {
      navigate('*');
      return;
    }

    sessionStorage.setItem('objectionId', id);
    setObj(id);

    return () => {
      sessionStorage.removeItem('objectionId');
    };
  }, [id]);

  return (
    <s.Container>
      <Header title="나의 이의 내역" />
      <s.MainArea>
        {!objectionDetail ? <LoadingSpinner /> : <ObjectionDetailForm objectionDetail={objectionDetail} />}
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ObjectionDetailPage;
