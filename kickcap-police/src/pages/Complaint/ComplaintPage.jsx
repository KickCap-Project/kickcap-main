import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Common/Header';
import { ReactComponent as search } from '../../asset/svg/search.svg';
import IconSvg from '../../components/Common/IconSvg';
import { Outlet, useLocation } from 'react-router';
import { usePageNavHook } from './../../lib/hook/usePageNavHook';
import { usePageTypeHook } from '../../lib/hook/usePageTypeHook';
import { useSearchParams } from 'react-router-dom';
import { getComplaintList } from '../../lib/api/complaint-api';
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
  const [state, setState] = useState(searchParams.get('state'));
  const [pageNo, setPageNo] = useState(searchParams.get('pageNo'));
  const [data, setData] = useState([]);
  const location = useLocation();
  const [name, setName] = useState('');
  const handleChangeSearch = (e) => {
    setName(e.target.value);
  };

  const handleEnterSearch = (e) => {
    if (e.keyCode === 13) {
      handleClickSearch();
    }
  };

  const handleClickSearch = async () => {
    setSearchParams({ state, pageNo: 1 });
    await getComplaintList(
      state,
      pageNo,
      name ? name : null,
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
            placeholder="작성자를 입력하세요"
            type="text"
            onChange={handleChangeSearch}
            value={name}
            onKeyDown={handleEnterSearch}
          />
          <IconSvg Ico={search} width={'30px'} cursor={'pointer'} onClick={handleClickSearch} />
        </s.searchArea>
      )}
      <s.mainArea>
        <Outlet context={{ name, data, setData }} />
      </s.mainArea>
    </s.Container>
  );
};

export default ComplaintPage;
