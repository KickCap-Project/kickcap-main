import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import CrackInfoTable from '../Common/CrackInfoTable';
import test from '../../asset/policeLogo.png';

const s = {
  Container: styled.div`
    width: 100%;
    height: 70%;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textBasic2};
  `,
  Header: styled.header`
    width: 100%;
    height: 100px;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    align-items: center;
    padding: 50px;
  `,
  MainArea: styled.div`
    width: 600px;
    margin: 40px auto;
  `,
};

const ReportInfoModal = ({ open, toggleModal }) => {
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={() => toggleModal(false)}
      className="centerSmallModal"
      overlayClassName="Overlay"
    >
      <s.Container>
        <s.Header>
          <Text
            children={'단속자 정보'}
            textalian={'center'}
            display={'block'}
            size={'30px'}
            bold={'700'}
            color={'textBasic2'}
          />
        </s.Header>
        <s.MainArea>
          <CrackInfoTable />
        </s.MainArea>
        <Button
          bold={'700'}
          children={'닫 기'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          display={'block'}
          margin={'0 auto'}
          onClick={() => toggleModal(false)}
        />
      </s.Container>
    </ReactModal>
  );
};

export default ReportInfoModal;
