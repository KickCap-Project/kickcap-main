import React, { useState } from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router';

import { setIsReadNote } from '../../lib/api/notification-api';
import { timeAgo } from '../../lib/data/ConvertTime';

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

const Notification = ({ note }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(note.isRead);

  // 입력되는 시간 데이터 확인해서 별도 수정 작업 필요 (timeAgo)

  // 읽음 처리 체크/처리 후 navigate 부분
  const handleMovePage = (idx, type, value, isRead) => {
    if (isRead === 'Y' && (type === 'APPROVE' || type === 'REJECT')) return;

    (async () => {
      try {
        const response = isRead === 'Y' ? true : await setIsReadNote(idx);

        if (response) {
          setIsRead('Y');

          switch (type) {
            case 'BILL':
            case 'DEADLINE':
              navigate('/violation/detail', { state: { idx: value } });
              break;
            case 'REPLY':
              navigate('/objection/detail', { state: { idx: value } });
              break;
            default:
              break;
          }
        }
      } catch (err) {
        // console.log(`${type} navigate할 수 없습니다.`);
      }
    })();
  };

  return (
    <s.NotificationArea onClick={() => handleMovePage(note.idx, note.type, note.value, isRead)}>
      <s.onArea>{isRead === 'N' ? <s.IsUnread /> : null}</s.onArea>
      <s.ContentArea>
        <s.Time>{timeAgo(note.date)}</s.Time>
        {/* <s.Time>{timeAgo(date)}</s.Time> */}
        <s.Content>{note.content}</s.Content>
      </s.ContentArea>
    </s.NotificationArea>
  );
};

export default Notification;
