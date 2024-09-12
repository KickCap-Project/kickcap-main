import React from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import ReportList from '../../components/Reported/ReportList';
import { ReactComponent as search } from '../../asset/svg/search.svg';
import IconSvg from '../../components/Common/IconSvg';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};

    overflow-y: auto;
  `,
  mainArea: styled.main``,
  searchArea: styled.div`
    width: 430px;
    height: 50px;
    display: flex;
    justify-content: space-around;
    background-color: ${(props) => props.theme.bgColor};
    align-items: center;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 2px, rgba(0, 0, 0, 0.3) 0px 3px 3px;
    position: relative;
    margin: 0 auto;
    top: -20px;
    z-index: 100;
  `,
  searchInput: styled.input`
    width: 350px;
    height: 50px;
    &::placeholder {
      color: ${(props) => props.theme.placeholderColor};
    }
  `,
};

const ReportListPage = () => {
  return (
    <s.Container>
      <Header title={'이 의 제 기'} subTitle={'단속 사항에 대한 문의 내역입니다.'} />
      <s.searchArea>
        <s.searchInput placeholder="작성자를 입력하세요" />
        <IconSvg Ico={search} width={'20px'} cursor={'pointer'} />
      </s.searchArea>
      <s.mainArea>
        <ReportList />
      </s.mainArea>
    </s.Container>
  );
};

export default ReportListPage;
