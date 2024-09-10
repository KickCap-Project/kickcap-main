import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: ${(props) => props.cursor};
  margin: ${(props) => props.margin};
  display: ${(props) => props.display};
  object-fit: ${(props) => props.fit};
`;
const s = {
  FeedImg: styled(Img)``,
  ProfileImg: styled(Img)`
    border-radius: 50%;
  `,
};

const Image = (props) => {
  return <>{props.type === 'rect' ? <s.FeedImg {...props} /> : <s.ProfileImg {...props} />}</>;
};

export default Image;
