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
