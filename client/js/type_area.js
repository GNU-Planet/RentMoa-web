/* 주택유형별 면적별 예측물량 */

document.addEventListener('DOMContentLoaded', function () {
  const chart = Highcharts.chart('type_area-graph-container', {
    title: {
      text: `${region} 단독 다가구 면적별 ${charterRent} 예측물량`,
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
        name: '40㎡ 미만',
        data: Object.values(result).map((item) => item['40㎡ 미만'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
      {
        name: '40-85㎡',
        data: Object.values(result).map((item) => item['40-85㎡'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
      {
        name: '85㎡ 이상',
        data: Object.values(result).map((item) => item['85㎡ 이상'] || 0),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
    ],
  });
});
