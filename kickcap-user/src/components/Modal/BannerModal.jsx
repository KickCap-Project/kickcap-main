import React from 'react';
import styled from 'styled-components';
import ReactModal from 'react-modal';

import Text from '../Common/Text';
import Button from '../Common/Button';

import { useAppSelector } from '../../lib/hook/useReduxHook';
import { selectBannerType } from '../../store/carouselModal';
import { BannerContent } from '../../lib/data/BannerContent';

const s = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 10px;
  `,
  HeaderArea: styled.div`
    width: 100%;
    height: 7vh;
    min-height: 50px;
    border-bottom: 1px solid #d3d3d3;
    background-color: ${(props) => props.theme.AreaColor};
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  MainArea: styled.div`
    width: 90%;
    margin: 20px auto;
  `,
  ContentArea: styled.div`
    margin-bottom: 2vh;
  `,
  Subtitle: styled.div`
    margin-bottom: 0.5vh;
  `,
  ButtonArea: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
  `,
};

const BannerModal = ({ open, toggleModal }) => {
  const type = useAppSelector(selectBannerType);
  const title = BannerContent[type]?.modal.title;
  const content = BannerContent[type]?.modal.content;

  if (!open) {
    return null;
  }

  return (
    <ReactModal isOpen={open} ariaHideApp={false} className="centerModal" overlayClassName="Overlay">
      <s.Container>
        <s.HeaderArea>
          <Text size={'20px'} bold={'800'} children={title} />
        </s.HeaderArea>
        <s.MainArea>
          {content.map((item, index) => (
            <s.ContentArea key={index}>
              <s.Subtitle>
                <Text size={'18px'} bold={'700'} children={item.subtitle} />
              </s.Subtitle>
              <Text size={'15px'} bold={'500'} children={item.subcontent} />
            </s.ContentArea>
          ))}

          <s.ButtonArea>
            <Button
              children={'확 인'}
              width={'110px'}
              height={'40px'}
              bold={'700'}
              size={'18px'}
              onClick={() => toggleModal(false)}
            />
          </s.ButtonArea>
        </s.MainArea>
      </s.Container>
    </ReactModal>
  );
};

export default BannerModal;
