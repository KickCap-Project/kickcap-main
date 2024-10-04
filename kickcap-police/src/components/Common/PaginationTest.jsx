import React, { useState } from 'react';
import styled from 'styled-components';

const s = {
  Container: styled.div`
    display: flex;
    justify-content: center;
    margin: 20px 0;
  `,
  Btn: styled.button`
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 20px;
    border: 1px solid red;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
};

const PaginationTest = ({ totalPosts, postsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const getPaginationRange = () => {
    const pages = [];
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1; // 현재 페이지에 따라 시작 페이지 계산
    const endPage = Math.min(startPage + 9, totalPages); // 시작 페이지에서 10개까지 표시

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pagesToShow = getPaginationRange();

  return (
    <s.Container>
      <s.Btn onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        이전
      </s.Btn>
      {pagesToShow.map((page) => (
        <s.Btn
          key={page}
          onClick={() => handlePageChange(page)}
          style={{ fontWeight: currentPage === page ? 'bold' : 'normal' }}
        >
          {page}
        </s.Btn>
      ))}
      <s.Btn onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        다음
      </s.Btn>
    </s.Container>
  );
};

export default PaginationTest;
