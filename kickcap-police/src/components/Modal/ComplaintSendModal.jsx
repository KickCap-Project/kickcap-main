import React, { useState } from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import TextArea from '../Common/TextArea';
import { postAnswer } from '../../lib/api/complaint-api';
import { useNavigate } from 'react-router';

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

const ComplaintSendModal = ({ open, toggleModal, id }) => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const handleChangeMessage = (e) => {
    setMsg(e.target.value);
  };
  const handleClickSend = async () => {
    await postAnswer(
      id,
      msg,
      (resp) => {
        alert('답변이 전송되었습니다.');
        setMsg('');
        toggleModal(false);
        navigate(`../../complaint?state=0&pageNo=1`);
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  };
  const handleClose = () => {
    setMsg('');
    toggleModal(false);
  };
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={handleClose}
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
            value={msg}
            onChange={handleChangeMessage}
          />
        </s.MapArea>
        <s.BtnArea>
          <Button bold={'700'} children={'닫 기'} height={'40px'} width={'150px'} size={'20px'} onClick={handleClose} />
          <Button
            bold={'700'}
            children={'답변 전송'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={handleClickSend}
          />
        </s.BtnArea>
      </s.Container>
    </ReactModal>
  );
};

export default ComplaintSendModal;
