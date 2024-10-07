import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // 추가된 플러그인
import styled from 'styled-components';
import React from 'react';

// 라이브러리 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels, // 추가된 플러그인
);

const s = {
  Container: styled.section`
    width: 100%;
    height: 80%;
    display: flex;
    border-radius: 10px;
    justify-content: center;
    margin: 0 auto;
    background-color: ${(props) => props.theme.dark};
  `,
};

const CircleChart = ({ title, labels, datas }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 부모 요소의 크기에 맞게 차트의 비율을 유지하지 않음
    plugins: {
      legend: {
        display: true, // legend 표시 여부
        position: 'right',
        labels: {
          boxWidth: 20,
          color: '#fff',
          font: {
            size: 10,
          },
        },
      },
      title: {
        text: title,
        position: 'top',
        color: '#fff',
        align: 'start',
        padding: {
          top: 0,
          bottom: 10,
        },
        display: true,
      },
      tooltip: {
        enabled: true, // tooltip 표시 여부
      },
      datalabels: {
        color: '#fff',
        display: false,
        anchor: 'end',
        align: 'top',
        formatter: (value) => value.toString(),
        font: {
          size: 12,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: datas,
        backgroundColor: ['#5EAC24', '#FFCB05', '#FF5023', '#00B6BD', '#1A6FB0'], // 예시 색상 배열
        borderColor: '#000', // 차트 테두리 색상
        borderWidth: 1, // 테두리 두께
      },
    ],
  };

  return (
    <s.Container>
      <Doughnut options={options} data={data} />
    </s.Container>
  );
};

export default React.memo(CircleChart);
