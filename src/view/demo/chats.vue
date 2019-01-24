<template>
    <div class="bg-white">
      <div id="main" class="w-100" style="height:300px;color:orange"></div>
    </div>
</template>

<script>

// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require("echarts/lib/component/markPoint");
  export default {
    data: function () {
    this.grid = {
        show: true,
        top: 50,
        left: 10,
        backgroundColor: '#FCF0ED',
        borderColor: '#dddddd',
      }
      this.markPoint = {
        data: [
          {
            name: '最大值',
            type: 'max'
          }
        ]
      }
      this.colors = ['#FC6B47']
      return {
        chartData: {
          columns: ['日期', '过去七日增员'],
          rows: [
            { '日期': '11.25', '过去七日增员': 1393},
            { '日期': '11.26', '过去七日增员': 3530},
            { '日期': '11.27', '过去七日增员': 2923},
            { '日期': '11.28', '过去七日增员': 1723},
            { '日期': '11.29', '过去七日增员': 3792},
            { '日期': '11.30', '过去七日增员': 4593},
            { '日期': '11.31', '过去七日增员': 1393}
          ],

        }
      }
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 绘制图表
      myChart.setOption({
          xAxis: {
              type: 'category',
              // boundaryGap: false,
              // axisTick:{
              //   show:false
              // },
              // axisLine:{
              //   show:false
              // },
              data: ['11.29', '11.30', '12.01', '12.02', '12.03', '12.04', '12.05']
          },
          grid:{
              show:true,
              backgroundColor:"#FCF0ED",
              borderColor: 'transparent',
          },
          yAxis: {
              show:true,
              type: 'value',
              // min:'dataMin',
              min: function(value) {
                  return Math.max(value.min - 2,0);
              },
              splitLine:{
                show:true,
                lineStyle:{
                  type:"dashed"
                }
              },
              // axisLine:{
              //   show:false
              // },
              // axisLabel:{
              //   show:false
              // },
              // axisTick:{
              //   show:false
              // }
          },
          series: [{
              data: [2, 93, 90, 93, 129, 1330, 132],
              type: 'line',
              lineStyle:{
                color:"#fc6b47"
              },
              itemStyle:{
                color:"#fc6b47"
              },
              // markPoint: {
              //   itemStyle:{
              //     color:"#fc6b47"
              //   },
              //   data: [
              //       {type: 'max', name: '最大值'},
              //       // {type: 'min', name: '最小值'}
              //   ]
              // },
              label: {
                  normal: {
                      show: true,
                      position: 'top'
                  }
              },
              markLine: {
                  data: [
                      {type: 'average', name: '平均值'}
                  ]
              }
          }]
      });

    },
  }
</script>