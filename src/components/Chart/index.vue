<template>
  <div class="bg-white charts">
    <p class="ft12 lh30 ta-c"><span class="title">{{ config.title }}</span></p>
    <div :id="config.id" class="w-100" :style="{'height': config.height +'px'}"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");

export default {
    props: {
        config: {
            type: Object,
            require: true
        }
    },
    methods: {
        charts(obj) {
            // console.log(obj)
            let self = this
            // 基于准备好的dom，初始化echarts实例
            const Chart = echarts.init(document.getElementById(obj.id));
            // 绘制图表
            Chart.setOption({
                xAxis: {
                    type: "category",
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#dddddd'
                        }
                        
                    },
                    data: obj.date  // 传入x轴
                },
                grid: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 0,
                    left: 10,
                    right: 10,
                    top: 25,
                    bottom: 30,
                    show: true,
                    backgroundColor: "#FCF0ED",
                    borderColor: "transparent"
                },
                yAxis: {
                    show: true,
                    type: "value",
                    min: function(value) {
                        return Math.max(value.min);
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: "dashed"
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [
                    {
                        data: obj.num, // 传入y轴
                        type: "line",
                        symbol: 'emptyCircle',
                        symbolSize: '8',
                        lineStyle: {
                            color: "#fc6b47"
                        },
                        itemStyle: {
                            color: "#fc6b47"
                        },
                        label: {
                            normal: {
                                show: true,
                                position: "top"
                            }
                        },
                        markLine: {
                            data: [{ 
                                type: "average", 
                                name: "平均值"
                            }]
                        }
                    }
                ]
            })
        }
    },
    mounted() {
        setTimeout(() => {
            this.charts(this.config)
        },800)
        
    }
};
</script>
<style lang="less">
    .charts {
        .title {
            position: relative;
            &:before {
                content: '';
                display: block;
                width: 100px;
                height: 1px;
                background-color: #dddddd;
                position: absolute;
                top: 50%;
                left: -110px;
            }
            &:after {
                content: '';
                display: block;
                width: 100px;
                height: 1px;
                background-color: #dddddd;
                position: absolute;
                top: 50%;
                right: -110px;
            }
        }
    }
</style>