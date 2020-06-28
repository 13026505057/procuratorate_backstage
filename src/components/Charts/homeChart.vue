<template>
    <div :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
export default {
    props: {
        option: [Object],
        id: [String],
        width: {
            type: String,
            default: '200px'
        },
        height: {
            type: String,
            default: '200px'
        }
    },
    data(){
        return{
            chart: null
        }
    },
    mounted(){
        this.initChart();
    },
    methods:{
        initChart(){
            this.chart = echarts.init(document.getElementById(this.id))
            const option = this.option;
            this.chart.setOption({
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#000'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: { interval: 0 }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '案件数',
                        min: 0,
                        max: 100
                    },
                ],
                series: [],
            })
        },
        resetChartData(){
            const option = this.option;
            this.chart.setOption({
                legend: {
                    data: option.legend.data
                },
                xAxis: [
                    {
                        type: 'category',
                        data: option.xAxis.data,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '案件数',
                        min: 0,
                        max: (option.yAxis[0].max + 10),
                    },
                ],
                series: option.series
            })
        }
    }
}
</script>