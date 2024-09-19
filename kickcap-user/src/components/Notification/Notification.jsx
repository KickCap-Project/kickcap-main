import React from 'react';
import styled from 'styled-components';

const s = {
  NotificationArea: styled.div`
    width: 100%;
    height: 60px;
    margin: 5px auto;
    display: flex;
    align-items: center;
    border: 1px solid ${(props) => props.theme.btnOff};
    border-radius: 10px;
    cursor: pointer;
  `,
  onArea: styled.div`
    width: 30px;
    height: 60%;
    display: flex;
    justify-content: end;
    /* border: 1px solid red; */
  `,
  IsUnread: styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.mainColor};
  `,
  ContentArea: styled.div`
    width: 95%;
    /* border: 1px solid red; */
    display: flex;
    flex-direction: column;
    margin-left: 15px;
  `,
  Content: styled.span`
    color: ${(props) => props.theme.textColor};
    font-size: 14px;
    font-weight: 500;
  `,
  Time: styled.span`
    color: #666666;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
  `,
};

const Notification = () => {
  return (
    <s.NotificationArea>
      <s.onArea>
        <s.IsUnread />
      </s.onArea>
      <s.ContentArea>
        <s.Time>{'3시간전'}</s.Time>
        <s.Content>단속 고지서가 도착했습니다.</s.Content>
      </s.ContentArea>
    </s.NotificationArea>
  );
};

export default Notification;
