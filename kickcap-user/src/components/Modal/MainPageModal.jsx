import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import logoutImg from '../../asset/img/svg/logout.svg';
import phoneImg from '../../asset/img/svg/phone.svg';
import Image from './../Common/Image';
import Text from './../Common/Text';
import { useAppDispatch } from '../../lib/hook/useReduxHook';
import { modalActions } from '../../store/modal';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    border-radius: 10px 10px 0 0;
    background-color: ${(props) => props.theme.bgColor};
  `,
  rect: styled.header`
    border-radius: 10px;
    background-color: ${(props) => props.theme.btnOff};
    width: 40%;
    height: 5px;
    margin: 20px auto;
  `,
  SvgArea: styled.div`
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  Svg: styled.div`
    width: 30%;
    cursor: pointer;
  `,
};

const MainPageModal = ({ open, toggleModal }) => {
  const dispatch = useAppDispatch();
  const handleOpenPhoneModal = (isFlag) => {
    toggleModal(false);
    dispatch(modalActions.ChangeIsPhone(isFlag));
  };
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={() => toggleModal(false)}
      className="Modal"
      overlayClassName="Overlay"
    >
      <s.Container>
        <s.rect />
        <s.SvgArea>
          <s.Svg onClick={() => handleOpenPhoneModal(true)}>
            <Image src={phoneImg} width="100%" />
            <Text
              children={'번호 변경'}
              color={'mainColor'}
              size={'20px'}
              bold={'800'}
              display={'block'}
              margin={'10px auto'}
              width={'100%'}
              textalian={'center'}
              cursor={'pointer'}
            />
          </s.Svg>
          <s.Svg>
            <Image src={logoutImg} width="100%" />
            <Text
              children={'로그아웃'}
              color={'negative'}
              size={'20px'}
              bold={'800'}
              display={'block'}
              margin={'10px auto'}
              width={'100%'}
              textalian={'center'}
              cursor={'pointer'}
            />
          </s.Svg>
        </s.SvgArea>
      </s.Container>
    </ReactModal>
  );
};

export default MainPageModal;
