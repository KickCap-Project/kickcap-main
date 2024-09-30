import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import ParkingMap from './ParkingMap';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
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
    height: 65%;
    margin: 20px auto;
  `,
  BtnArea: styled.div`
    width: 50%;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
  `,
};

const ReportParkModal = ({ open, toggleModal, kick, park }) => {
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
        <Text
          children={'마커 위에 마우스를 올리면 마커 정보를 볼 수 있습니다.'}
          textalian={'center'}
          display={'block'}
          size={'15px'}
          bold={'700'}
          color={'textBasic2'}
          width={'100%'}
          margin={'5px auto'}
        />
        <Text
          children={'제공되는 주차장 정보는 차이가 있을 수 있으니 참고용으로 확인하시기 바랍니다.'}
          textalian={'center'}
          display={'block'}
          size={'15px'}
          bold={'700'}
          color={'textBasic2'}
          width={'100%'}
        />
        <s.MapArea>
          <ParkingMap Park={park} kickBoard={kick} />
        </s.MapArea>
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
