import React, { useEffect, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { getListDetail, postCancel } from '../../lib/api/complaint-api';
import { getCrackDetail } from './../../lib/api/crack-api';
const s = {
  Container: styled.main`
    width: 100%;
    margin: 0 auto;
  `,
  TableArea: styled.div`
    width: 100%;
    margin: 20px auto;
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
    justify-content: center;
    margin: 30px auto;
  `,
  Line: styled.hr`
    border-color: ${(props) => props.theme.mainColor};
  `,
  AnswerHead: styled.div`
    width: 100%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  AnswerContent: styled.div`
    width: 100%;
    border: 1px solid #d3d3d3;
    min-height: 100px;
    border-radius: 10px;
    padding: 10px;
    font-weight: 500;
    white-space: pre-line;
    line-height: 30px;
  `,
};

const ComplaintDetail = () => {
  useModalExitHook();
  const [searchParams, setSearchParams] = useSearchParams();
  const complaintId = searchParams.get('detail');
  const state = searchParams.get('state');
  const pageNo = useLocation().state?.pageNo;
  const [complaintData, setComplaintData] = useState({});
  const [crackData, setCrackData] = useState({});
  const dispatch = useAppDispatch();
  const isInfo = useAppSelector(selectIsComplaintInfo);
  const isSend = useAppSelector(selectIsComplaintSend);
  const handleOpenInfoModal = (isFlag) => {
    dispatch(modalActions.ChangeIsComplaintInfo(isFlag));
  };
  const handleOpenSendModal = (isFlag) => {
    dispatch(modalActions.ChangeIsComplaintSend(isFlag));
  };
  const navigate = useNavigate();
  const handleMoveList = () => {
    navigate(`../../complaint?state=${state}&pageNo=${pageNo ? pageNo : 1}`);
  };

  const handleCrackCancel = async () => {
    const name = localStorage.getItem('police');
    const message = `안녕하세요. ${name} 입니다.\n본 사항을 관할 부서에서 확인 결과, 고지서에 문제가 있다고 판단하여 해당 단속 내역은 취소되었음을 알려드립니다.
    안전한 킥보드 문화를 위해 저희 ${name}가 앞장서서 노력하겠습니다. \n감사합니다.`;

    if (window.confirm('정말로 고지를 취소하시겠습니까?')) {
      await postCancel(
        complaintData.idx,
        message,
        (resp) => {
          alert('고지서가 취소되었습니다.');
          navigate(`../../complaint?state=${state}&pageNo=${pageNo ? pageNo : 1}`);
        },
        (error) => {
          alert('잠시 후 다시 시도해주세요.');
        },
      );
    }
  };

  useEffect(() => {
    getListDetail(
      complaintId,
      (resp) => {
        setComplaintData(resp.data);
        getCrackDetail(
          resp.data.crackDownIdx,
          (resp) => {
            setCrackData(resp.data);
          },
          (error) => {
            alert('잠시 후 다시 시도해주세요.');
          },
        );
      },
      (error) => {
        alert('잠시 후 다시 시도해주세요.');
      },
    );
  }, []);

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
              <s.Td>{complaintData.idx}</s.Td>
              <s.Td>{complaintData.name}</s.Td>
              <s.Td>{complaintData.violationType}</s.Td>
              <s.Td>{complaintData.date}</s.Td>
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
        <Input
          mode={'read'}
          width={'100%'}
          display={'block'}
          size={'20px'}
          height={'50px'}
          value={complaintData.title}
        />
        <Text
          children={'내용'}
          textalian={'left'}
          display={'block'}
          size={'20px'}
          bold={'700'}
          color={'textBasic2'}
          margin={'20px 0 10px 0'}
        />
        <TextArea
          mode={'read'}
          display={'block'}
          width={'100%'}
          height={'290px'}
          size={'20px'}
          value={complaintData.content}
        />
        {complaintData.responseDate && (
          <>
            <s.Line />
            <s.AnswerHead>
              <Text
                children={'기관 답변'}
                textalian={'left'}
                display={'block'}
                size={'20px'}
                bold={'700'}
                color={'textBasic2'}
              />
              <Text
                children={complaintData.responseDate}
                textalian={'left'}
                display={'block'}
                size={'20px'}
                bold={'700'}
                color={'textBasic2'}
              />
            </s.AnswerHead>
            <s.AnswerContent>{complaintData.responseContent}</s.AnswerContent>
          </>
        )}
        <s.BtnArea>
          <Button
            bold={'700'}
            children={'목록으로'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={handleMoveList}
            display={'block'}
            margin={'0 10px'}
          />
          <Button
            bold={'700'}
            children={'단속 정보'}
            height={'40px'}
            width={'150px'}
            size={'20px'}
            onClick={() => handleOpenInfoModal(true)}
            display={'block'}
            margin={'0 10px'}
          />
          {state === '0' && (
            <>
              <Button
                bold={'700'}
                children={'사유 답변'}
                height={'40px'}
                width={'150px'}
                size={'20px'}
                onClick={() => handleOpenSendModal(true)}
                display={'block'}
                margin={'0 10px'}
              />
              <Button
                bold={'700'}
                children={'고지 취소'}
                height={'40px'}
                width={'150px'}
                size={'20px'}
                onClick={handleCrackCancel}
                display={'block'}
                margin={'0 10px'}
              />
            </>
          )}
        </s.BtnArea>
      </s.MainArea>
      <ComplaintInfoModal open={isInfo} toggleModal={handleOpenInfoModal} data={crackData} />
      <ComplaintSendModal open={isSend} toggleModal={handleOpenSendModal} id={complaintData.idx} />
    </s.Container>
  );
};

export default ComplaintDetail;
