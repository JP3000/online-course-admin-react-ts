export default {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          // { value: 1048, name: '前端开发' },
          // { value: 735, name: 'Java开发' },
          // { value: 580, name: '运维工程师' },
          // { value: 484, name: '测试工程师' },
          // { value: 300, name: 'UI设计' }
        ]
      }
    ]
  };