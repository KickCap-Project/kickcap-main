import React from 'react';
import styled from 'styled-components';

const s = {
  Bot: styled.div`
    width: fit-content;
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    background-color: ${(props) => props.theme.PhoneModalColor};
    color: ${(props) => props.theme.textBasic2};
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.25;
  `,
  MyChat: styled.div`
    width: fit-content;
    max-width: 70%;
    padding: 10px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    background-color: ${(props) => props.theme.mainColor};
    color: ${(props) => props.theme.textBasic};
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 1.25;
  `,
  MyChatArea: styled.div`
    display: flex;
    justify-content: end;
    padding: 10px 0 10px 0;
  `,
  BotChatArea: styled.div`
    display: flex;
    padding: 10px 0 10px 0;
  `,
};

const Chat = ({ messages }) => {
  const info = JSON.parse(localStorage.getItem('Info'));
  const name = info.name;

  return (
    <>
      <s.BotChatArea>
        <s.Bot>
          {name}님! 오늘도 안전운행하세요!
          <br />
          오늘은 무엇을 도와드릴까요?
        </s.Bot>
      </s.BotChatArea>

      {messages.map((msg, index) =>
        msg.sender === 'bot' ? (
          <s.BotChatArea key={index}>
            <s.Bot>{msg.text}</s.Bot>
          </s.BotChatArea>
        ) : (
          <s.MyChatArea>
            <s.MyChat>{msg.text}</s.MyChat>
          </s.MyChatArea>
        ),
      )}
    </>
  );
};

export default Chat;
