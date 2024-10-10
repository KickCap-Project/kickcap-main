import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import Header from './../Header';
import Text from '../Common/Text';
import Input from './../Common/Input';
import MainButton from '../MainButton';
import Button from './../Common/Button';

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
    width: 90%;
    margin: 20px auto;
  `,
  NumArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

const InfoModal = ({ open, toggleModal }) => {
  return (
    <ReactModal isOpen={open} ariaHideApp={false} className="centerModal" overlayClassName="Overlay">
      <s.Container>
        <s.HeaderArea>
          <Text size={20} bold={'800'} children={'정보 입력'} />
        </s.HeaderArea>
        <s.MainArea>
          <Text size={'12px'} bold={'500'} children={'사용자 성명'} display={'block'} margin={'10px auto'} />
          <s.NumArea>
            <Input
              width={'100%'}
              height={'30px'}
              InputColor={'PhoneModalColor'}
              size={'15px'}
              textalian={'center'}
              placeholder={'성명을 입력해주세요.'}
            />
          </s.NumArea>
          <Text size={'12px'} bold={'500'} children={'전화번호'} display={'block'} margin={'10px auto'} />
          <s.NumArea>
            <Input width={'30%'} height={'30px'} InputColor={'PhoneModalColor'} size={'15px'} textalian={'center'} />
            <Input width={'30%'} height={'30px'} InputColor={'PhoneModalColor'} size={'15px'} textalian={'center'} />
            <Input width={'30%'} height={'30px'} InputColor={'PhoneModalColor'} size={'15px'} textalian={'center'} />
          </s.NumArea>
          <Button
            children={'인증번호 발송'}
            width={'180px'}
            height={'40px'}
            bold={'700'}
            size={'18px'}
            display={'block'}
            margin={'20px auto'}
          />
          <Text size={'12px'} bold={'500'} children={'인증번호'} display={'block'} margin={'10px auto'} />
          <s.NumArea>
            <Input width={'70%'} height={'30px'} InputColor={'PhoneModalColor'} size={'15px'} textalian={'center'} />
            <Button children={'확인'} width={'28%'} height={'30px'} bold={'700'} size={'18px'} display={'block'} />
          </s.NumArea>
          <Button
            children={'확 인'}
            width={'110px'}
            height={'40px'}
            bold={'700'}
            size={'18px'}
            display={'block'}
            margin={'20px auto'}
            onClick={() => toggleModal(false)}
          />
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default InfoModal;
