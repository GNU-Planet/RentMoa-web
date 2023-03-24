document.addEventListener('DOMContentLoaded', function () {
  const chart = Highcharts.chart('graph-container-01', {
    title: {
      text: '진주시 단독다가구 전월세 물량 예측 (2023년 하반기)',
    },

    subtitle: {
      text: '자료: 국토교통부 단독/다가구 전월세 자료',
    },

    chart: {
      renderTo: 'container',
      type: 'column',
    },

    yAxis: {
      title: {
        text: 'Number of Employees',
      },
    },

    legend: {
      layout: 'vertical',

      align: 'right',

      verticalAlign: 'middle',
    },

    series: [
      {
        name: 'Installation',

        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
      },
    ],
  });
});
