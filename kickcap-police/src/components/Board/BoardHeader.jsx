import React from 'react';
import styled from 'styled-components';
// import { ReactComponent as logo } from '../../asset/svg/logo.svg';
import { ReactComponent as logo } from '../../asset/svg/police.svg';
import { navActions, selectNav } from '../../store/nav';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import IconSvg from '../Common/IconSvg';
import { useNavigate } from 'react-router';
import Button from './../Common/Button';
import { logout } from '../../lib/api/main-api';

const s = {
  fixedArea: styled.div`
    width: 100%;
    height: 50px;
    position: fixed;
    background-color: #1c1c25;
    z-index: 100;
  `,
  topArea: styled.div`
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 15px;
  `,
  mainArea: styled.div`
    height: 150px;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  `,
  TitleArea: styled.div`
    width: 40%;
    display: flex;
    justify-content: start;
    align-content: center;
  `,
  Title: styled.div`
    width: 100%;
    font-weight: 700;
    font-size: 18px;
    height: 40px;
    color: ${(props) => props.theme.textBasic};
    display: flex;
    align-items: center;
    cursor: default;
  `,
  NavArea: styled.div`
    width: 60%;
    display: flex;
    justify-content: space-around;
    align-content: center;
  `,
  Nav: styled.div`
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 3px solid ${(props) => props.color || '#1C1C25'};
    color: ${(props) => props.theme.textBasic};
    cursor: pointer;
  `,
  nameArea: styled.div`
    font-size: 10px;
    color: ${(props) => props.theme.textBasic};
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: 10px;
  `,
  Btn: styled.button`
    width: 55px;
    font-size: 10px;
    color: #000;
    background-color: ${(props) => props.theme.AreaColor};
    border-radius: 5px;
    font-weight: 700;
    height: 20px;
    margin: 0 5px;
  `,
};

const BoardHeader = () => {
  const navigate = useNavigate();
  const policeName = localStorage.getItem('police');
  const type = useAppSelector(selectNav);
  const dispatch = useAppDispatch();
  const handleClickIcon = (mode) => {
    dispatch(navActions.change(mode));
    if (mode === 'board') {
      navigate(`/${mode}`);
    } else if (mode === 'complaint') {
      navigate(`/${mode}?state=receipt&pageNo=1`);
    } else {
      navigate(`/${mode}?violationType=3&pageNo=1`);
    }
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };

  const handleLogout = async () => {
    const fcmToken = localStorage.getItem('fcmToken');
    await logout(
      fcmToken,
      (resp) => {
        localStorage.removeItem('fcmToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('police');
        navigate('/');
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  };
  return (
    <>
      <s.fixedArea>
        <s.topArea>
          <s.TitleArea>
            <IconSvg Ico={logo} width={'30px'} margin={'0 10px 0 0'} />
            <s.Title>
              킥보드 자동화 단속 플랫폼<s.nameArea>({policeName})</s.nameArea>
              <s.Btn onClick={handleLogout}>로그아웃</s.Btn>
            </s.Title>
          </s.TitleArea>
          <s.NavArea>
            <s.Nav onClick={() => handleClickIcon('board')} color={getColor('board')}>
              현황 지도
            </s.Nav>
            <s.Nav onClick={() => handleClickIcon('crackdown')} color={getColor('crackdown')}>
              단속 리스트
            </s.Nav>
            <s.Nav onClick={() => handleClickIcon('report')} color={getColor('report')}>
              국민 신고함
            </s.Nav>
            <s.Nav onClick={() => handleClickIcon('complaint')} color={getColor('complaint')}>
              이의 제기
            </s.Nav>
          </s.NavArea>
        </s.topArea>
      </s.fixedArea>
    </>
  );
};

export default BoardHeader;
