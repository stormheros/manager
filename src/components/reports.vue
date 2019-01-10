<template>
    <el-card class="card">
         <my-bread level1="数据统计" level2="数据报表"></my-bread>
          <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            
        }
    }, mounted(){
        this.initEcharts()
    }
    ,methods:{
        async initEcharts(){
         const res = await this.$http.get(`reports/type/1`)
         console.log(res)
     var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        const option1 = {
    title: {
        text: '堆叠区域图'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    }
}
const option2 = res.data.data
const option = {...option1,...option2}
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        }
    }
}
</script>

<style>

</style>
