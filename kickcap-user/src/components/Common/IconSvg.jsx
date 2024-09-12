import React from 'react';

const IconSvg = ({ Ico, width, height, color, cursor, margin, display, onClick }) => {
  return (
    <Ico
      style={{ cursor: cursor, margin: margin, display: display }}
      width={width}
      height={height}
      fill={color}
      cursor={cursor}
      onClick={onClick}
    />
  );
};

export default IconSvg;
