/* 법정동별 예측물량 */

document.addEventListener('DOMContentLoaded', function () {
  const chart = Highcharts.chart('dong-graph-container', {
    title: {
      text: `${region} 법정동별 ${charterRent} 예측물량`,
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
        name: charterRent,
        data: Object.values(result),
        dataLabels: {
          enabled: true,
          format: '{y}',
          inside: true,
        },
      },
    ],
  });
});
