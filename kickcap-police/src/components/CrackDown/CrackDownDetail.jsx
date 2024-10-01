import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import test from '../../asset/policeLogo.png';
import CrackInfoTable from '../Common/CrackInfoTable';
import Button from '../Common/Button';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { getCrackDetail } from '../../lib/api/crack-api';
import moment from 'moment';
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
    height: 450px;
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

const CrackDownDetail = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const crackId = searchParams.get('detail');
  const violationType = searchParams.get('violationType');
  const pageNo = useLocation().state?.pageNo;
  const [crackData, setCrackData] = useState({});
  const handleMoveList = () => {
    navigate(`../../crackdown?violationType=${violationType}&pageNo=${pageNo ? pageNo : 1}`);
  };

  useEffect(() => {
    getCrackDetail(
      crackId,
      (resp) => {
        setCrackData(resp.data);
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
              <s.Th style={{ width: '10%' }}>단속 번호</s.Th>
              <s.Th style={{ width: '40%' }}>단속 주소</s.Th>
              <s.Th style={{ width: '15%' }}>단속 종류</s.Th>
              <s.Th style={{ width: '10%' }}>날 짜</s.Th>
            </s.Tr>
          </s.Thead>
          <s.Tbody>
            <s.Tr>
              <s.Td>{crackData.idx}</s.Td>
              <s.Td>{crackData.crackAddr}</s.Td>
              <s.Td>{crackData.violationType}</s.Td>
              <s.Td>{moment(crackData.date).format('YY-MM-DD')}</s.Td>
            </s.Tr>
          </s.Tbody>
        </s.Table>
      </s.TableArea>
      <s.MainArea>
        <s.Img src={crackData.img} />
        <s.InfoArea>
          <CrackInfoTable data={crackData} />
          <s.BtnArea>
            <Button
              bold={'700'}
              children={'목록으로'}
              height={'40px'}
              width={'250px'}
              size={'20px'}
              onClick={handleMoveList}
            />
          </s.BtnArea>
        </s.InfoArea>
      </s.MainArea>
    </s.Container>
  );
};

export default CrackDownDetail;
