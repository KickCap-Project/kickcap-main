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

const Chat = () => {
  return (
    <>
      <s.BotChatArea>
        <s.Bot>
          무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을
          도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을 도와드릴까요?무엇을
          도와드릴까요?
        </s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.BotChatArea>
        <s.Bot>무엇을 도와드릴까요?</s.Bot>
      </s.BotChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
      <s.MyChatArea>
        <s.MyChat>킥보드 법률을 알려줘</s.MyChat>
      </s.MyChatArea>
    </>
  );
};

export default Chat;
