import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';

import Text from '../Common/Text';
import Button from '../Common/Button';

import useReportMap from '../../lib/hook/useReportMap';

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
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  Map: styled.div`
    width: 85%;
    height: 95%;
  `,
  ButtonArea: styled.div`
    display: flex;
    justify-content: center;
    gap: 3%;
    margin-bottom: 1vh;
  `,
};

const ReportGetPositionModal = ({ open, toggleModal }) => {
  const [loc, setLoc] = useState({ lat: 0, lng: 0 });

  const { mapRef, handleSetLocation } = useReportMap(loc);

  const handleSetLocationAndClose = async () => {
    try {
      await handleSetLocation();
      toggleModal(false);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };

  useEffect(() => {
    if (open && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, [open]);

  const success = (pos) => {
    const crd = pos.coords;
    setLoc({
      lat: crd.latitude,
      lng: crd.longitude,
    });
  };

  const error = (err) => {
    console.log(`Error: ${err}`);
  };

  return (
    <ReactModal
      isOpen={open}
      ariaHidaApp={false}
      className="centerModal"
      overlayClassName="Overlay"
      style={{
        content: {
          width: '80vw',
          maxWidth: '800px',
          height: 'auto',
          padding: 0,
          border: 'none',
          borderRadius: '10px',
          margin: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}
    >
      <s.Container>
        <s.HeaderArea>
          <Text size={20} bold={'800'} children={'위치 설정'} />
        </s.HeaderArea>
        <s.MainArea>
          <s.Map ref={mapRef} />
        </s.MainArea>

        <s.ButtonArea>
          <Button
            children={'설 정'}
            width={'110px'}
            height={'40px'}
            bold={'700'}
            size={'18px'}
            display={'block'}
            onClick={() => handleSetLocationAndClose()}
          />

          <Button
            children={'닫 기'}
            width={'110px'}
            height={'40px'}
            bold={'700'}
            size={'18px'}
            display={'block'}
            onClick={() => toggleModal(false)}
          />
        </s.ButtonArea>
      </s.Container>
    </ReactModal>
  );
};

export default ReportGetPositionModal;
