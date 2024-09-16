import React from 'react';
import styled from 'styled-components';
import test from '../../asset/policeLogo.png';
import CrackInfoTable from '../Common/CrackInfoTable';
import Button from '../Common/Button';
import Text from '../Common/Text';
import TextArea from '../Common/TextArea';
import Input from '../Common/Input';
import ComplaintInfoModal from '../Modal/ComplaintInfoModal';
import ComplaintSendModal from './../Modal/ComplaintSendModal';
import { useModalExitHook } from '../../lib/hook/useModalExitHook';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { modalActions, selectIsComplaintInfo, selectIsComplaintSend } from '../../store/modal';
const s = {
  Container: styled.main`
    width: 100%;
    margin: 0 auto;
  `,
  TableArea: styled.div`
    width: 100%;
    margin: 20px auto;
    border: 1px solid black;
  `,
  Table: styled.table`
    width: 700px;
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
    width: 90%;
    height: 550px;
    margin: 0 auto 30px;
    border-radius: 10px;
    padding: 20px;
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    border-right: 4px solid rgba(0, 0, 0, 0.2);
    box-shadow: inset -5px 0 5px -5px #333, inset 5px 0 5px -5px #333;
    align-items: center;
  `,
  BtnArea: styled.div`
    width: 800px;
    display: flex;
    justify-content: space-between;
    border: 1px solid orange;
    margin: 30px auto;
  `,
};

const ComplaintDetail = () => {
  useModalExitHook();

  const dispatch = useAppDispatch();
  const isInfo = useAppSelector(selectIsComplaintInfo);
  const isSend = useAppSelector(selectIsComplaintSend);
  const handleOpenInfoModal = (isFlag) => {
    dispatch(modalActions.ChangeIsComplaintInfo(isFlag));
  };
  const handleOpenSendModal = (isFlag) => {
    dispatch(modalActions.ChangeIsComplaintSend(isFlag));
  };
  return (
    <s.Container>
      <s.TableArea>
        <s.Table>
          <s.Thead>
            <s.Tr>
              <s.Th style={{ width: '10%' }}>문의 번호</s.Th>
              <s.Th style={{ width: '30%' }}>작성자</s.Th>
              <s.Th style={{ width: '30%' }}>단속 종류</s.Th>
              <s.Th style={{ width: '10%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            <s.Tr>
              <s.Td>10</s.Td>
              <s.Td>오진영</s.Td>
              <s.Td>안전모 미착용</s.Td>
              <s.Td>24.09.01</s.Td>
            </s.Tr>
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.MainArea>
        <Text
          children={'제목'}
          textalian={'left'}
          display={'block'}
          size={'20px'}
          bold={'700'}
          color={'textBasic2'}
          margin={'20px 0 10px 0'}
        />
        <Input width={'100%'} display={'block'} size={'20px'} height={'50px'} />
        <Text
          children={'내용'}
          textalian={'left'}
          display={'block'}
          size={'20px'}
          bold={'700'}
          color={'textBasic2'}
          margin={'20px 0 10px 0'}
        />
        <TextArea display={'block'} width={'100%'} height={'290px'} size={'20px'} />
        <s.BtnArea>
          <Button bold={'700'} children={'이 전'} height={'40px'} width={'150px'} size={'20px'} />
          <Button
            bold={'700'}
            children={'단속 정보'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={() => handleOpenInfoModal(true)}
          />
          <Button
            bold={'700'}
            children={'사유 답변'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={() => handleOpenSendModal(true)}
          />
          <Button bold={'700'} children={'고지 취소'} height={'40px'} width={'150px'} size={'20px'} />
        </s.BtnArea>
      </s.MainArea>
      <ComplaintInfoModal open={isInfo} toggleModal={handleOpenInfoModal} />
      <ComplaintSendModal open={isSend} toggleModal={handleOpenSendModal} />
    </s.Container>
  );
};

export default ComplaintDetail;
