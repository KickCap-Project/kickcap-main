import React from 'react';
import styled from 'styled-components';
import test from '../../asset/policeLogo.png';
import CrackInfoTable from '../Common/CrackInfoTable';
import Button from '../Common/Button';
import Text from '../Common/Text';
import TextArea from './../Common/TextArea';
import ReportInfoModal from '../Modal/ReportInfoModal';
import ReportParkModal from './../Modal/ReportParkModal';
import { useModalExitHook } from './../../lib/hook/useModalExitHook';
import { useAppDispatch, useAppSelector } from '../../lib/hook/useReduxHook';
import { modalActions, selectIsReportInfo, selectIsReportPark } from '../../store/modal';
import { useNavigate } from 'react-router';
const s = {
  Container: styled.main`
    width: 90%;
    margin: 0 auto;
  `,
  TableArea: styled.div`
    width: 100%;
    margin: 20px auto;
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
    width: 90%;
    height: 500px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  Img: styled.img`
    width: 50%;
    height: 100%;
    max-width: 400px;
    max-height: 400px;
    margin: 0 auto;
  `,
  InfoArea: styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  BtnArea: styled.div`
    width: 800px;
    display: flex;
    justify-content: space-between;
    margin: 30px auto;
  `,
};

const ReportDetail = () => {
  useModalExitHook();

  const dispatch = useAppDispatch();
  const isInfo = useAppSelector(selectIsReportInfo);
  const isPark = useAppSelector(selectIsReportPark);
  const handleOpenInfoModal = (isFlag) => {
    dispatch(modalActions.ChangeIsReportInfo(isFlag));
  };
  const handleOpenParkModal = (isFlag) => {
    dispatch(modalActions.ChangeIsReportPark(isFlag));
  };

  const navigate = useNavigate();
  const handleMoveList = () => {
    navigate('..');
  };

  const handleReportAccess = () => {
    const message = '산고 대상자에게 단속고지서를 발부되었습니다.';
    if (window.confirm('승인하시겠습니까?')) {
      alert('고지서가 발부되었습니다.');
      navigate('..');
    }
  };

  const handleReportReject = () => {
    const message = '해당 신고는 검토 결과 반려되었습니다.';
    if (window.confirm('반려하시겠습니까?')) {
      alert('신고가 반려되었습니다.');
      navigate('..');
    }
  };
  return (
    <s.Container>
      <s.TableArea>
        <s.Table>
          <s.Thead>
            <s.Tr>
              <s.Th style={{ width: '10%' }}>신고 번호</s.Th>
              <s.Th style={{ width: '40%' }}>단속 주소</s.Th>
              <s.Th style={{ width: '15%' }}>신고 종류</s.Th>
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
          <Text
            children={'내용'}
            textalian={'left'}
            display={'block'}
            size={'20px'}
            bold={'700'}
            color={'textBasic2'}
            margin={'20px 0 10px 0'}
          />
          <TextArea mode={'read'} display={'block'} width={'100%'} height={'100%'} size={'20px'} />
        </s.InfoArea>
      </s.MainArea>
      <s.BtnArea>
        <Button
          bold={'700'}
          children={'목록으로'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          onClick={handleMoveList}
        />
        <Button
          bold={'700'}
          children={'주차 확인'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          onClick={() => handleOpenParkModal(true)}
        />
        <Button
          bold={'700'}
          children={'단속자 정보'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          onClick={() => handleOpenInfoModal(true)}
        />
        <Button
          bold={'700'}
          children={'반 려'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          onClick={handleReportReject}
        />
        <Button
          bold={'700'}
          children={'고지서 전송'}
          height={'40px'}
          width={'150px'}
          size={'20px'}
          onClick={handleReportAccess}
        />
      </s.BtnArea>
      <ReportParkModal open={isPark} toggleModal={handleOpenParkModal} />
      <ReportInfoModal open={isInfo} toggleModal={handleOpenInfoModal} />
    </s.Container>
  );
};

export default ReportDetail;
