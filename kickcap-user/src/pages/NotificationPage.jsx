import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notification from './../components/Notification/Notification';
import NotificationEmpty from '../components/Notification/NotificationEmpty';

import LoadingSpinner from '../components/Common/LoadingSpinner';
import { getNotificationList } from '../lib/api/notification-api';

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
    justify-content: ${(props) => (props.center ? 'center' : 'flex-start')};
    flex-direction: column;
    align-items: center;
    padding: 10px;
  `,
  NotificationArea: styled.div`
    flex: 1;
    flex-basis: 0;
    width: 100%;
    overflow-y: auto;
  `,
  LoadingSpinnerArea: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `
};

const NotificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    (async () => {
      if (isLoading) return;

      setIsLoading(true);

      try {
        const response = await getNotificationList();
        setNoteList(response);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <s.Container>
      <Header title={'알 림'} />
      <s.MainArea center={isLoading || noteList.length === 0}>
        {isLoading ? (
          <s.LoadingSpinnerArea>
            <LoadingSpinner />
          </s.LoadingSpinnerArea>
        ) : (
          <s.NotificationArea>
            {noteList.length > 0 ? (
              noteList.map((note) => <Notification key={note.idx} note={note} />)
            ) : (
              <NotificationEmpty />
            )}
          </s.NotificationArea>
        )}
      </s.MainArea>
      <Footer />
    </s.Container>
  );
};

export default NotificationPage;
