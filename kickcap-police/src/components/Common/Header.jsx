import React from 'react';
import styled from 'styled-components';
import Text from './Text';
import { ReactComponent as logo } from '../../asset/svg/logo.svg';
import IconSvg from './IconSvg';
import { navActions, selectNav } from '../../store/nav';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { useNavigate } from 'react-router';

const s = {
  Container: styled.header`
    height: 150px;
  `,
  fixedArea: styled.div`
    width: 100%;
    height: 50px;
    position: fixed;
    background-color: ${(props) => props.theme.textBasic};
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
    width: 30%;
    display: flex;
    justify-content: start;
    align-content: center;
  `,
  Title: styled.div`
    font-weight: 700;
    size: 15px;
    color: ${(props) => props.theme.textBasic2};
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
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    size: 15px;
    font-weight: 700;
    border-bottom: 3px solid ${(props) => props.color || props.theme.textBasic};
    cursor: pointer;
  `,
};

const Header = ({ title, subTitle }) => {
  const navigate = useNavigate();
  const type = useAppSelector(selectNav);
  const dispatch = useAppDispatch();
  const handleClickIcon = (mode) => {
    dispatch(navActions.change(mode));
    navigate('/' + mode);
  };

  const getColor = (mode) => {
    return type === mode ? '#0054A6' : undefined;
  };
  return (
    <>
      <s.fixedArea>
        <s.topArea>
          <s.TitleArea>
            <IconSvg Ico={logo} width={'30px'} margin={'0 15px 0 0'} />
            <s.Title>킥보드 자동화 단속 플랫폼</s.Title>
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
      <s.Container>
        <s.mainArea>
          <Text
            children={title}
            textalian={'center'}
            margin={'0 auto 10px'}
            display={'block'}
            size={'50px'}
            bold={'700'}
            color={'textBasic2'}
          />
          <Text
            children={subTitle}
            textalian={'center'}
            margin={'0 auto'}
            display={'block'}
            size={'15px'}
            bold={'500'}
            color={'textBasic2'}
          />
        </s.mainArea>
      </s.Container>
    </>
  );
};

export default Header;
