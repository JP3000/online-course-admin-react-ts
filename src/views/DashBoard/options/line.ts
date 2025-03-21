export default {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis',
      show: false
    },
    legend: {
      bottom: '0%',
      data: ['今天', '昨天']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '今天',
        type: 'line',
        stack: 'Total',
        smooth: true,
        symbol: 'none',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '昨天',
        type: 'line',
        stack: 'Total',
        smooth: true,
        symbol: 'none',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
    ]
  };