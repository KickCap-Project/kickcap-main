import React from 'react';
import styled from 'styled-components';
import test from '../../asset/policeLogo.png';
import CrackInfoTable from '../Common/CrackInfoTable';
import Button from '../Common/Button';
import Text from '../Common/Text';
import TextArea from './../Common/TextArea';
const s = {
  Container: styled.main`
    width: 90%;
    margin: 0 auto;
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
    height: 500px;
    margin: 0 auto;
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  Img: styled.img`
    width: 450px;
    height: 450px;
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
    width: 800px;
    display: flex;
    justify-content: space-between;
    border: 1px solid orange;
    margin: 30px auto;
  `,
};

const ReportDetail = () => {
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
          <TextArea display={'block'} width={'100%'} height={'100%'} size={'20px'} />
        </s.InfoArea>
      </s.MainArea>
      <s.BtnArea>
        <Button bold={'700'} children={'이 전'} height={'40px'} width={'150px'} size={'20px'} />
        <Button bold={'700'} children={'주차 확인'} height={'40px'} width={'150px'} size={'20px'} />
        <Button bold={'700'} children={'단속자 정보'} height={'40px'} width={'150px'} size={'20px'} />
        <Button bold={'700'} children={'반 려'} height={'40px'} width={'150px'} size={'20px'} />
        <Button bold={'700'} children={'고지서 전송'} height={'40px'} width={'150px'} size={'20px'} />
      </s.BtnArea>
    </s.Container>
  );
};

export default ReportDetail;
