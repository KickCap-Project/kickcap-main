import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';

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
  MapArea: styled.div`
    width: 80%;
    height: 500px;
    border: 1px solid red;
    margin: 20px auto;
  `,
  BtnArea: styled.div`
    width: 50%;
    border: 1px solid red;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
  `,
};

const ReportParkModal = ({ open, toggleModal }) => {
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={() => toggleModal(false)}
      className="centerBigModal"
      overlayClassName="Overlay"
    >
      <s.Container>
        <s.Header>
          <Text
            children={'주차위치 정보'}
            textalian={'center'}
            display={'block'}
            size={'30px'}
            bold={'700'}
            color={'textBasic2'}
          />
        </s.Header>
        <s.MapArea />
        <s.BtnArea>
          <Button
            bold={'700'}
            children={'닫 기'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={() => toggleModal(false)}
          />
        </s.BtnArea>
      </s.Container>
    </ReactModal>
  );
};

export default ReportParkModal;
