import styled from 'styled-components';

import Docu from '../../asset/img/svg/docu.svg';
import Megaphone from '../../asset/img/svg/megaphone.svg';
import ObjChat from '../../asset/img/svg/obj_chat.svg';
import SOS from '../../asset/img/svg/sos.svg';
import AIChat from '../../asset/img/svg/chat.svg';
import Money from '../../asset/img/svg/money.svg';

const TextIndent = styled.div`
  text-indent: 0.5rem;
  font-size: ${(props) => props.size || 'inherit'};
  font-weight: ${(props) => props.bold || 'inherit'};
  line-height: 1.25;
`;

const RedText = styled.span`
  color: red;
  font-size: ${(props) => props.size || 'inherit'};
  font-weight: ${(props) => props.bold || 'inherit'};
`;

export const BannerContent = {
  Violation: {
    banner: {
      title: '단속내역 확인 및 범칙금 납부',
      contentA: '이용자의 단속 이력과 상세정보를 한눈에 조회하고',
      contentB: '범칙금을 간편하게 납부할 수 있습니다.',
      imgSrc: Docu,
    },
    modal: {
      title: '단속내역 확인 및 간편 납부',
      content: [
        {
          subtitle: '1. 단속 내역 확인',
          subcontent: (
            <TextIndent>
              이용자의 단속 내역 목록을 단속 처리 상태에 따라 한눈에 확인하고, 각 단속의 세부 정보를 조회할 수 있습니다.
            </TextIndent>
          ),
        },
        {
          subtitle: '2. 고지서 확인',
          subcontent: (
            <TextIndent>
              이용자에게 발부된 고지서를 확인할 수 있으며, 세부 정보와 <RedText>납부 기한</RedText>도 함께 제공됩니다.
            </TextIndent>
          ),
        },
        {
          subtitle: '3. 범칙금 납부',
          subcontent: (
            <>
              <TextIndent>고지서 상세 내역에서 간편하게 범칙금 납부를 하실 수 있습니다.</TextIndent>
              <TextIndent>
                벌점이 누적된 경우 <RedText>범칙금 납부 전 별도의 교통안전 교육을 이수</RedText>해야 할 수 있으며,
                정해진 기간 내에 <RedText>미납 시 범칙금이 가중 부과</RedText>될 수 있습니다.
              </TextIndent>
            </>
          ),
        },
      ],
    },
  },
  Report: {
    banner: {
      title: '불량 이용 제보하기',
      contentA: '거리를 활보하는 범법 킥보드를 신고할 수 있습니다.',
      contentB: '관련 기관에서 검토 후 처리됩니다.',
      imgSrc: Megaphone,
    },
    modal: {
      title: '불량 이용 제보하기',
      content: [
        {
          subtitle: '1. 제보하기',
          subcontent: (
            <>
              <TextIndent>
                킥보드의 불량 이용 상황을 목격했을 때 제보 기능을 통해 신고하실 수 있습니다. 제보 시에는  <RedText>상황 사진과 킥보드 번호</RedText>를 입력해야 합니다.
              </TextIndent>
              <br />
              <TextIndent>신고 대상은 다음과 같습니다.</TextIndent>
              <TextIndent>· 불법 주차</TextIndent>
              <TextIndent>· 안전모 미착용</TextIndent>
              <TextIndent>· 다인 승차</TextIndent>
              <TextIndent>· 보도 주행</TextIndent>
              <TextIndent>· 지정 차로 위반</TextIndent>
            </>
          ),
        },
        {
          subtitle: '2. 검토 및 처리',
          subcontent: (
            <>
              <TextIndent>관련 기관에서 제보 내용을 검토 후 처리되며, 사용자에게 처리 결과가 안내됩니다.</TextIndent>
            </>
          ),
        },
      ],
    },
  },
  Objection: {
    banner: {
      title: '이의 제기하기',
      contentA: '단속 사항에 문제가 있을 경우 이의 신청을 할 수 있습니다.',
      contentB: '관련 기관에서 검토 후 처리됩니다.',
      imgSrc: ObjChat,
    },
    modal: {
      title: '이의 제기하기',
      content: [
        {
          subtitle: '1. 이의 제기하기',
          subcontent: (
            <>
              <TextIndent>
                이용자는 단속 세부 정보를 확인한 후 문제가 있다고 판단될 경우 해당 건에 대한 이의 제기를 할 수 있습니다.
              </TextIndent>
              <TextIndent>
                이의 제기는 <RedText>단속 건당 1회</RedText>만 가능하며, 이의 제기를 한 단속 목록은{' '}
                <RedText>이의 제기 내역 페이지</RedText>에서 확인할 수 있습니다.
              </TextIndent>
            </>
          ),
        },
        {
          subtitle: '2. 검토 및 처리',
          subcontent: (
            <>
              <TextIndent>
                관련 기관에서 이의 제기 내용을 검토 후 답변을 제공하며, 처리 결과는 사용자에게 안내됩니다. 이의 제기
                상태는 실시간으로 확인할 수 있습니다.
              </TextIndent>
            </>
          ),
        },
      ],
    },
  },
  SOS: {
    banner: {
      title: '원 클릭 신고',
      contentA: '킥보드 이용 중 사고 발생 시 클릭 한번으로 신고 가능!',
      contentB: '관할 경찰서에 자동으로 신고가 접수됩니다.',
      imgSrc: SOS,
    },
    modal: {
      title: '원 클릭 신고 기능',
      content: [
        {
          subtitle: '원 클릭 신고 기능',
          subcontent: (
            <>
              <TextIndent>
                킥보드 이용 중 사고 발생 시 <RedText>관할 경찰서에 빠르게 신고</RedText>할 수 있는{' '}
                <RedText>원클릭 신고 기능</RedText>을 제공합니다.
              </TextIndent>
              <TextIndent>
                신고 시 <RedText>신고자 정보, 신고 시각, 위치 정보</RedText>가 자동으로 관할 경찰서에 접수됩니다.
              </TextIndent>
              <TextIndent>
                허위 신고가 적발될 경우, <RedText>112신고처리법</RedText>에 따라 <RedText>형사처벌</RedText>을 받을 수
                있으니 유의해주세요.
              </TextIndent>
            </>
          ),
        },
      ],
    },
  },
  AIChat: {
    banner: {
      title: 'PM 관련 법률 챗봇 지원',
      contentA: '이동형 전동장치(PM)에 관한 법률 정보를 챗봇이 제공!',
      contentB: '법을 잘 몰라도 챗봇이 친절히 알려줘요~',
      imgSrc: AIChat,
    },
    modal: {
      title: 'PM 관련 법률 챗봇 지원',
      content: [
        {
          subtitle: '법률 챗봇 이용',
          subcontent: (
            <>
              <TextIndent>
                이동형 전동장치(PM)에 대한 법률 정보를 쉽게 제공받을 수 있도록 <RedText>법률 챗봇 서비스</RedText>를
                지원합니다.
              </TextIndent>
              <TextIndent>
                챗봇은 사용자의 질문에 따라 <RedText>관련 법률 조항</RedText>을 빠르게 안내하며,  <RedText>메인 페이지 우측 하단</RedText>의 아이콘을 눌러 언제든지 편리하게 이용 가능합니다.
              </TextIndent>
            </>
          ),
        },
      ],
    },
  },
  Penalty: {
    banner: {
      title: '범칙금 및 벌점 안내',
      contentA: '안전한 킥보드 문화를 함께 만들어가요!',
      contentB: '',
      imgSrc: Money,
    },
    modal: {
      title: '범칙금 및 벌점 안내',
      content: [
        {
          subtitle: '범칙금 안내',
          subcontent: (
            <>
              <TextIndent>
                킥보드 이용 시 다음의 위반 사항에 대해 <RedText>범칙금</RedText>과 <RedText>벌점</RedText>이 부과됩니다.
              </TextIndent>
              <br />
              <TextIndent>· 불법 주차: 범칙금 2만원 + 벌점 2점</TextIndent>
              <TextIndent>· 안전모 미착용: 범칙금 2만원 + 벌점 2점</TextIndent>
              <TextIndent>· 다인 승차: 범칙금 4만원 + 벌점 5점</TextIndent>
              <TextIndent>· 보도 주행: 범칙금 3만원 + 벌점 3점</TextIndent>
              <TextIndent>· 지정 차로 위반: 범칙금 1만원 + 벌점 1점</TextIndent>
              <br />
              <TextIndent>
                벌점이 일정 이상 누적된 경우 <RedText>범칙금 납부 전 별도의 교통안전 교육을 이수</RedText>해야 하며,
                교육 이수 후 벌점이 일부 차감됩니다.
              </TextIndent>
            </>
          ),
        },
        {
          subtitle: '안전한 킥보드 문화를 함께 만들어가요!',
          subcontent: '',
        },
      ],
    },
  },
};
