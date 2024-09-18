import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import TextArea from '../Common/TextArea';

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
    height: 90%;
    margin: 20px auto;
  `,
  BtnArea: styled.div`
    width: 50%;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
  `,
};

const ComplaintSendModal = ({ open, toggleModal }) => {
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
            children={'이의제기 답변란'}
            textalian={'center'}
            display={'block'}
            size={'30px'}
            bold={'700'}
            color={'textBasic2'}
          />
        </s.Header>
        <s.MapArea>
          <Text
            children={'답변 내용'}
            textalian={'left'}
            display={'block'}
            size={'20px'}
            bold={'700'}
            color={'textBasic2'}
            margin={'20px 0 10px 0'}
          />
          <TextArea
            display={'block'}
            width={'100%'}
            height={'90%'}
            size={'15px'}
            placeholder={'내용을 입력해주세요.'}
          />
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
          <Button bold={'700'} children={'답변 전송'} height={'40px'} width={'150px'} size={'20px'} />
        </s.BtnArea>
      </s.Container>
    </ReactModal>
  );
};

export default ComplaintSendModal;
