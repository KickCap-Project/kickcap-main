import React, { useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';

import Text from '../Common/Text';
import Button from '../Common/Button';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 10px;
  `,
  HeaderArea: styled.div`
    width: 100%;
    height: 7vh;
    min-height: 50px;
    border-bottom: 1px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  MainArea: styled.div`
    width: 100%;
    height: 50vh;
    border: 3px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Map: styled.div`
    width: 85%;
    height: 95%;
    border: 1px solid black;
  `,
};

const ReportGetPositionModal = ({ open, toggleModal }) => {
  const [loc, setLoc] = useState({ lat: 0, lng: 0 });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition();
  }

  return (
    <ReactModal isOpen={open} ariaHidaApp={false} className="centerModal" overlayClassName="Overlay">
      <s.Container>
        <s.HeaderArea>
          <Text size={20} bold={'800'} children={'위치 설정'} />
        </s.HeaderArea>
        <s.MainArea>
          <s.Map></s.Map>
        </s.MainArea>

        <Button
          children={'닫 기'}
          width={'110px'}
          height={'40px'}
          bold={'700'}
          size={'18px'}
          display={'block'}
          margin={'20px auto'}
          onClick={() => toggleModal(false)}
        />
      </s.Container>
    </ReactModal>
  );
};

export default ReportGetPositionModal;
