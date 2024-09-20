import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Chat from '../components/Chat/Chat';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Footer from '../components/Footer';

const s = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${(props) => props.theme.bgColor};
  `,
  MainArea: styled.div`
    width: 90%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  `,
  MessageArea: styled.div`
    flex: 1;
    flex-basis: 0;
    width: 100%;
    overflow-y: auto;
  `,

  SendArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px auto;
  `,
};

const ChatPage = () => {
  return (
    <s.Container>
      <Header title={'법률 지원 챗봇'} />
      <s.MainArea>
        <s.MessageArea>
          <Chat />
        </s.MessageArea>
        <s.SendArea>
          <Input placeholder={'메세지를 입력하세요.'} width={'78%'} height={'40px'} />
          <Button bold={'700'} children={'입력'} size={'15px'} width={'20%'} height={'40px'} display={'block'} />
        </s.SendArea>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ChatPage;
