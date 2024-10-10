import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import { ReactComponent as search } from '../../asset/svg/search.svg';
import IconSvg from '../../components/Common/IconSvg';
import { Outlet, useLocation } from 'react-router';
import { usePageNavHook } from './../../lib/hook/usePageNavHook';
import { usePageTypeHook } from '../../lib/hook/usePageTypeHook';
import { useSearchParams } from 'react-router-dom';
import { getComplaintList, getComplaintTotalCount } from '../../lib/api/complaint-api';

const s = {
  Container: styled.div`
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
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
  `,
  searchInput: styled.input`
    width: 350px;
    height: 50px;
    &::placeholder {
      color: ${(props) => props.theme.placeholderColor};
    }
  `,
};

const ComplaintPage = () => {
  usePageNavHook('complaint');
  usePageTypeHook('complaint');

  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const location = useLocation();

  // useRef를 사용하여 name 상태를 관리
  const phoneRef = useRef('');

  const handleChangeSearch = (e) => {
    phoneRef.current = e.target.value; // useRef를 통해 현재 입력값을 업데이트
  };

  const handleEnterSearch = (e) => {
    if (e.keyCode === 13) {
      handleClickSearch();
    }
  };

  const handleClickSearch = async () => {
    const phone = phoneRef.current;
    await getComplaintTotalCount(
      searchParams.get('state'),
      phone ? phone : null,
      (resp) => {
        setTotalPage(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );

    await getComplaintList(
      searchParams.get('state'),
      searchParams.get('pageNo'),
      phone ? phone : null,
      (resp) => {
        setData(resp.data);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  };

  return (
    <s.Container>
      <Header title={'이 의 제 기'} subTitle={'단속 사항에 대한 문의 내역입니다.'} />
      {location.pathname === '/complaint' && (
        <s.searchArea>
          <s.searchInput
            placeholder="연락처로 검색해보세요. (-를 포함해주세요.)"
            type="text"
            onChange={handleChangeSearch}
            defaultValue={phoneRef.current} // 초기 값 설정
            onKeyDown={handleEnterSearch}
          />
          <IconSvg Ico={search} width={'30px'} cursor={'pointer'} onClick={handleClickSearch} />
        </s.searchArea>
      )}
      <s.mainArea>
        <Outlet context={{ phone: phoneRef.current, data, setData, totalPage, setTotalPage }} />
      </s.mainArea>
    </s.Container>
  );
};

export default ComplaintPage;
