import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import EmergencyMap from './EmergencyMap';
import { postMove } from '../../lib/api/main-api';
import moment from 'moment';
import 'moment/locale/ko';

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
  MainArea: styled.div`
    width: 750px;
    margin: 30px auto;
    display: flex;
    justify-content: space-between;
  `,
  MapArea: styled.div`
    width: 350px;
    height: 350px;
  `,
  InfoArea: styled.div`
    width: 350px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  Table: styled.table`
    width: 100%;
    margin: 0 auto;
  `,
  Tbody: styled.tbody`
    text-align: center;
    font-size: 12px;
  `,
  Tr: styled.tr`
    width: 100%;
    height: 40px;
    cursor: default;
  `,
  Td: styled.td`
    vertical-align: middle;
    border: 1px solid ${(props) => props.theme.textBasic2};
  `,
  Th: styled.th`
    width: 80px;
    font-size: 13px;
    font-weight: 700;
    color: ${(props) => props.theme.textBasic2};
    vertical-align: middle;
    background-color: ${(props) => props.theme.AreaColor};
    border: 1px solid ${(props) => props.theme.textBasic2};
  `,
};

const BoardEmergencyModal = ({ open, toggleModal, data }) => {
  const hanldleMove = async () => {
    if (window.confirm('신고자 연락처를 확인하셨습니까?')) {
      await postMove(
        data.idx,
        (resp) => {
          alert('신고자에게 출동 알림을 보냈습니다.');
          toggleModal(false);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
    }
  };
  return (
    <ReactModal isOpen={open} ariaHideApp={false} className="centerSmallModal" overlayClassName="Overlay">
      <s.Container>
        <s.Header>
          <Text
            children={'긴급 신고 접수 알림'}
            textalian={'center'}
            display={'block'}
            size={'30px'}
            bold={'700'}
            color={'textBasic2'}
          />
        </s.Header>
        <s.MainArea>
          <s.MapArea>
            <EmergencyMap accident={{ lat: data.lat, lng: data.lng }} />
          </s.MapArea>
          <s.InfoArea>
            <s.Table>
              <s.Tbody>
                <s.Tr>
                  <s.Th>신고자 성함</s.Th>
                  <s.Td>{data.name}</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>신고 주소</s.Th>
                  <s.Td>{data.addr}</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>신고 시각</s.Th>
                  <s.Td>{moment(data.time).format('YYYY-MM-DD A hh:mm')}</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>연락처</s.Th>
                  <s.Td>{data.phone}</s.Td>
                </s.Tr>
              </s.Tbody>
            </s.Table>
            <Text
              children={'신고자 연락처 확인 후 먼저 유선 연결 하십시오.'}
              textalian={'center'}
              display={'block'}
              size={'15px'}
              bold={'700'}
              color={'negative'}
            />
            <Button
              bold={'700'}
              children={'출동 알림 보내기'}
              height={'40px'}
              width={'100%'}
              size={'20px'}
              display={'block'}
              margin={'0 auto'}
              onClick={hanldleMove}
            />
          </s.InfoArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default BoardEmergencyModal;
