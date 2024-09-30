import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import test from '../../asset/policeLogo.png';
import CameraCrackList from '../Board/CameraCrackList';
import { dummy } from '../../lib/data/CameraCrackData';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.dark};
    color: ${(props) => props.theme.textBasic2};
  `,
  Header: styled.header`
    width: 100%;
    height: 100px;
    background-color: #1c1c25;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 50px;
  `,
  MainArea: styled.div`
    width: 90%;
    height: 550px;
    margin: 20px auto;
    display: flex;
    justify-content: space-between;
  `,
  Img: styled.img`
    width: 400px;
    height: 400px;
  `,
  InfoArea: styled.div`
    width: 50%;
    height: 100%;
    overflow: auto;
  `,
  BtnArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
    margin: 30px auto;
  `,
};

const BoardCameraModal = ({ open, toggleModal, idx, data }) => {
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
            children={data.addr}
            textalian={'center'}
            display={'block'}
            size={'25px'}
            bold={'700'}
            color={'textBasic'}
          />
          <Button
            bold={'700'}
            children={'닫 기'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={() => toggleModal(false)}
          />
        </s.Header>
        <s.MainArea>
          <s.Img src={test} />
          <s.InfoArea>
            {data.crackdown && data.crackdown.map((data, index) => <CameraCrackList key={index} data={data} />)}
          </s.InfoArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default BoardCameraModal;
