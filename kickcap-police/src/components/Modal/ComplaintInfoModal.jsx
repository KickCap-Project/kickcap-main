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
  TableArea: styled.div`
    width: 100%;
    margin: 20px auto;
    border: 1px solid black;
  `,
  Table: styled.table`
    width: 90%;
    margin: 0 auto;
  `,
  Thead: styled.thead``,
  Tbody: styled.tbody`
    text-align: center;
  `,
  Tr: styled.tr`
    width: 100%;
    height: 40px;
    cursor: default;
  `,
  Td: styled.td`
    vertical-align: middle;
  `,
  Th: styled.th`
    font-weight: 700;
    color: ${(props) => props.theme.textBasic2};
    vertical-align: middle;
  `,
  MainArea: styled.div`
    width: 80%;
    height: 450px;
    margin: 0 auto;
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
  `,
  Img: styled.img`
    width: 400px;
    height: 400px;
  `,
  InfoArea: styled.div`
    width: 50%;
    height: 450px;
    border: 1px solid green;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  BtnArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
    border: 1px solid orange;
    margin: 30px auto;
  `,
};

const ComplaintInfoModal = ({ open, toggleModal }) => {
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={toggleModal}
      className="centerBigModal"
      overlayClassName="Overlay"
    >
      <s.Container>
        <s.Header>
          <Text
            children={'이의제기 단속 정보'}
            textalian={'center'}
            display={'block'}
            size={'30px'}
            bold={'700'}
            color={'textBasic2'}
          />
        </s.Header>
        <s.TableArea>
          <s.Table>
            <s.Thead>
              <s.Tr>
                <s.Th style={{ width: '10%' }}>단속 번호</s.Th>
                <s.Th style={{ width: '40%' }}>단속 주소</s.Th>
                <s.Th style={{ width: '15%' }}>단속 종류</s.Th>
                <s.Th style={{ width: '10%' }}>날 짜</s.Th>
              </s.Tr>
            </s.Thead>
            <s.Tbody>
              <s.Tr>
                <s.Td>10</s.Td>
                <s.Td>대전 유성구 학하북로 75-21</s.Td>
                <s.Td>안전모 미착용</s.Td>
                <s.Td>24.09.01</s.Td>
              </s.Tr>
            </s.Tbody>
          </s.Table>
        </s.TableArea>
        <s.MainArea>
          <s.Img src={test} />
          <s.InfoArea>
            <CrackInfoTable />
            <s.BtnArea>
              <Button bold={'700'} children={'닫 기'} height={'40px'} width={'150px'} size={'20px'} />
            </s.BtnArea>
          </s.InfoArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default ComplaintInfoModal;
