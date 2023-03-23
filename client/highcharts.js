console.log('ff');

document.addEventListener('DOMContentLoaded', function () {
  const chart = Highcharts.chart('graph-container-01', {
    title: {
      text: 'Solar Employment Growth by Sector, 2010-2016',
    },

    subtitle: {
      text: 'Source: thesolarfoundation.com',
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
