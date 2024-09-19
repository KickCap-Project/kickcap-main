import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import CrackInfoTable from '../Common/CrackInfoTable';
import test from '../../asset/policeLogo.png';

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
    margin: 40px auto;
    display: flex;
    justify-content: space-between;
  `,
  MapArea: styled.div`
    width: 350px;
    height: 350px;
    border: 1px solid red;
  `,
  InfoArea: styled.div`
    width: 350px;
    border: 1px solid red;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  //
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

const BoardEmergencyModal = ({ open, toggleModal }) => {
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={toggleModal}
      className="centerSmallModal"
      overlayClassName="Overlay"
    >
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
          <s.MapArea></s.MapArea>
          <s.InfoArea>
            <s.Table>
              <s.Tbody>
                <s.Tr>
                  <s.Th>신고자 성함</s.Th>
                  <s.Td>홍길동</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>신고 주소</s.Th>
                  <s.Td>대전 유성구 한밭대로 15-12</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>신고 시각</s.Th>
                  <s.Td>2024. 08. 15. 오후 2시 16분</s.Td>
                </s.Tr>
                <s.Tr>
                  <s.Th>연락처</s.Th>
                  <s.Td>010-1111-1111</s.Td>
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
            />
          </s.InfoArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default BoardEmergencyModal;
