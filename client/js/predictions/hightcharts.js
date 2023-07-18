// 아파트, 오피스텔, 연립다세대 그래프
// 전세 그래프
const drawAverageDepositGraph = (data) => {
  // 월 별로 데이터를 그룹화하여 평균 값 계산
  const monthlyData = {};
  data.forEach((contractData) => {
    const month = contractData.날짜.split('.').slice(0, 2).join('.');
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(contractData.금액);
  });

  const months = Object.keys(monthlyData);
  const averageDeposits = months.map((month) => {
    const deposits = monthlyData[month];
    const average = Math.floor(
      deposits.reduce((sum, deposit) => sum + deposit, 0) / deposits.length,
    );
    return average;
  });

  Highcharts.chart('deposit-graph-container', {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: months,
      reversed: true,
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    plotOptions: {
      line: {
        marker: {
          enabled: false, // 점 숨김
        },
      },
    },
    series: [
      {
        name: '전세금',
        data: averageDeposits,
      },
    ],
  });
};

// 단독다가구
const drawTypeAreaGraph = (data) => {
  Highcharts.chart('type_area-graph-container', {
    title: {
      text: '',
    },
    chart: {
      renderTo: 'container',
      type: 'bar',
    },
    xAxis: {
      categories: ['12평 미만', '12평-26평', '26평 이상'],
    },
    yAxis: {
      title: {
        text: '호',
      },
    },
    legend: {
      enabled: false, // 전체 그래프 타입 선택 버튼 숨기기
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    series: [
      {
        name: '전세',
        data: [
          data['전세']['40㎡ 미만'],
          data['전세']['40-85㎡'],
          data['전세']['85㎡ 이상'],
        ],
      },
      {
        name: '월세',
        data: [
          data['월세']['40㎡ 미만'],
          data['월세']['40-85㎡'],
          data['월세']['85㎡ 이상'],
        ],
      },
    ],
  });
};

const drawBuiltYearGraph = (data) => {
  Highcharts.chart('built_year-graph-container', {
    title: {
      text: '',
    },
    chart: {
      renderTo: 'container',
      type: 'bar',
    },
    xAxis: {
      categories: ['10년 미만', '10-20년', '20-30년', '30년 이상'],
    },
    yAxis: {
      title: {
        text: '호',
      },
    },
    legend: {
      enabled: false, // 전체 그래프 타입 선택 버튼 숨기기
    },
    plotOptions: {
      series: {
        stacking: 'normal',
      },
    },
    series: [
      {
        name: '전세',
        data: [
          data['전세']['10년 미만'],
          data['전세']['10-20년'],
          data['전세']['20-30년'],
          data['전세']['30년 이상'],
        ],
      },
      {
        name: '월세',
        data: [
          data['월세']['10년 미만'],
          data['월세']['10-20년'],
          data['월세']['20-30년'],
          data['월세']['30년 이상'],
        ],
      },
    ],
  });
};
