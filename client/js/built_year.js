/* 건축연한별 예측물량 */

document.addEventListener('DOMContentLoaded', function () {
  const chart = Highcharts.chart('built_year-graph-container', {
    title: {
      text: `${region} 단독 다가구 건축연한별 ${charterRent} 예측물량`,
    },

    subtitle: {
      text: '기간: 2023년도 하반기(7월~12월)',
    },

    chart: {
      renderTo: 'container',
      type: 'column',
    },

    xAxis: {
      categories: Object.keys(result),
    },

    yAxis: {
      title: {
        text: '단위: 호',
      },
    },

    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },

    series: [
      {
        name: '10년 미만',
        data: Object.values(result).map((item) => item['10년 미만'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
      {
        name: '10-20년',
        data: Object.values(result).map((item) => item['10-20년'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
      {
        name: '20-30년',
        data: Object.values(result).map((item) => item['20-30년'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
      {
        name: '30년 이상',
        data: Object.values(result).map((item) => item['30년 이상'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
    ],
  });
});
