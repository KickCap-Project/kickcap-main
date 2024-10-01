import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import '../../styles/modal.css';
import Text from '../Common/Text';
import Button from '../Common/Button';
import CrackInfoTable from '../Common/CrackInfoTable';
import test from '../../asset/policeLogo.png';
import moment from 'moment';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
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
  `,
  Table: styled.table`
    width: 80%;
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
    font-size: 15px;
  `,
  Th: styled.th`
    font-weight: 700;
    color: ${(props) => props.theme.textBasic2};
    vertical-align: middle;
  `,
  MainArea: styled.div`
    width: 80%;
    height: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
  `,
  Img: styled.img`
    width: 47%;
    height: auto;
    max-width: 380px;
    max-height: 380px;
  `,
  InfoArea: styled.div`
    width: 50%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  BtnArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: end;
    margin: 30px auto;
  `,
};

const ComplaintInfoModal = ({ open, toggleModal, data }) => {
  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      onRequestClose={() => toggleModal(false)}
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
                <s.Td>{data.idx}</s.Td>
                <s.Td>{data.crackAddr}</s.Td>
                <s.Td>{data.violationType}</s.Td>
                <s.Td>{moment(data.date).format('YY-MM-DD')}</s.Td>
              </s.Tr>
            </s.Tbody>
          </s.Table>
        </s.TableArea>
        <s.MainArea>
          <s.Img src={data.img} />
          <s.InfoArea>
            <CrackInfoTable data={data} />
            <s.BtnArea>
              <Button
                bold={'700'}
                children={'닫 기'}
                height={'40px'}
                width={'150px'}
                size={'20px'}
                onClick={() => toggleModal(false)}
              />
            </s.BtnArea>
          </s.InfoArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default ComplaintInfoModal;
