import React, { useState } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Chat from '../components/Chat/Chat';
import Input from '../components/Common/Input';
import Button from '../components/Common/Button';
import Footer from '../components/Footer';

import { sendMessage } from '../lib/api/chatbot-api';

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
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // axios
      const response = await sendMessage(input);

      const botReply = { sender: 'bot', text: response };
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (err) {}

    setInput('');
  };

  return (
    <s.Container>
      <Header title={'법률 지원 챗봇'} />
      <s.MainArea>
        <s.MessageArea>
          <Chat messages={messages} />
        </s.MessageArea>
        <s.SendArea>
          <Input
            placeholder={'메세지를 입력하세요.'}
            width={'78%'}
            height={'40px'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            bold={'700'}
            children={'입력'}
            size={'15px'}
            width={'20%'}
            height={'40px'}
            display={'block'}
            onClick={handleSend}
          />
        </s.SendArea>
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default ChatPage;
