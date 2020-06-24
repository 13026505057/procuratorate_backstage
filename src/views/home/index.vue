<template>
   <div class="homePage">
      <div class="table" style="width: 100%;height:400px;">
        <div class="tableTop">入库案件按部门统计</div>
        <Statistics ref="inCaseDep" :id="'inDepStatistics'" :option="StatisticsOption.inCaseDep" height="100%" width="100%"/>
      </div>
      <div class="table" style="width: 100%;height:400px;">
        <div class="tableTop">出库案件按部门统计</div>
        <Statistics ref="outCaseDep" :id="'outDepStatistics'" :option="StatisticsOption.outCaseDep" height="100%" width="100%"/>
      </div>
      <div class="table" style="width: 100%;height:400px;">
        <div class="tableTop">入库案件按时间统计 </div>
        <Statistics ref="inCaseTime" :id="'inTimeStatistics'" :option="StatisticsOption.inCaseTime" height="100%" width="100%"/>
      </div>
      <div class="table" style="width: 100%;height:400px;">
        <div class="tableTop">出库案件按时间统计</div>
        <Statistics ref="outCaseTime" :id="'outTimeStatistics'" :option="StatisticsOption.outCaseTime" height="100%" width="100%"/>
      </div>
   </div>
</template>

<script>
import Statistics from '@/components/Charts/homeChart'
import { mapActions } from 'vuex'
import router from '@/router'
import store from '@/store'
import { setToken } from '@/utils/auth'
export default {
  components:{ Statistics },
  data(){
    return{
      StatisticsOption: {
        // 入库按部门
        inCaseDep: { 
          legend: {},
          xAxis: { data: [] },
          yAxis: [{ max: 0, }],
          series: [{ type: 'bar', data: [] }]
        },
        // 出库按部门
        outCaseDep: {
          legend: {},
          xAxis: { data: [] },
          yAxis: [{ max: 0, }],
          series: [{ type: 'bar', data: [] }]
        },
        // 入库按时间
        inCaseTime: {
          legend: {},
          xAxis: { data: [] },
          yAxis: [{ max: 0, }],
          series: [{ type: 'bar', data: [] }]
        },
        // 出库按时间
        outCaseTime: {
          legend: {},
          xAxis: { data: [] },
          yAxis: [{ max: 0, }],
          series: [{ type: 'bar', data: [] }]
        },
      }
    }
  },
  mounted(){
    this.accordUrlLogin();
  },
  methods: {
    ...mapActions({'setTokenData':'user/setTokenData'}),
    async getDataList(){
      let inCaseDep = await this.$api.getInCaseCountByDept();
      let outCaseDep = await this.$api.getOutCaseCountByDept();
      let inCaseTime = await this.$api.getInCaseCountByMonth();
      let outCaseTime = await this.$api.getOutCaseCountByMonth();

      let dataInfo = {
        inCaseDep: [{ dom:'dept_name', num: 'quantity' }],
        outCaseDep: [{ dom:'dept_name', num: 'quantity' }],
        inCaseTime: [{ dom:'month', num: 'quantity' }],
        outCaseTime: [{ dom:'month', num: 'quantity' }],
      };
      let dataData = {
        inCaseDep: inCaseDep.data,
        outCaseDep: outCaseDep.data,
        inCaseTime: inCaseTime.data,
        outCaseTime: outCaseTime.data,
      }
      Object.keys(dataData).map((item,index)=>{
        let xAxis=[], series=[], max = 0;
        dataData[item].map(itemCenter=>{
          dataInfo[item].map(itemChild=>{
            if(max < Number(itemCenter[itemChild.num])) max = Number(itemCenter[itemChild.num])
            xAxis.push(itemCenter[itemChild.dom])
            series.push(Number(itemCenter[itemChild.num]))
          })
        })
        this.StatisticsOption[item].xAxis.data = xAxis
        this.StatisticsOption[item].series[0].data = series
        this.StatisticsOption[item].yAxis[0].max = max
      })
      this.$nextTick(()=>{
        this.$refs.inCaseDep.resetChartData();
        this.$refs.outCaseDep.resetChartData();
        this.$refs.inCaseTime.resetChartData();
        this.$refs.outCaseTime.resetChartData();
      })
    },
    async accordUrlLogin(){
      const RouteQuery = this.$route.query;
      if(Object.keys(RouteQuery).length>0) {
        let resultData = await this.$api.commonIsLogin({ username: RouteQuery.userName, org_id: RouteQuery.orgId })
        this.setTokenData(resultData.data.token)
        this.getDataList();

        const roles = await store.dispatch('user/getInfo')
        
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

      } else this.getDataList();
    }
  }
}
</script>

<style lang="scss">
  .homePage{
    .table{
      .tableTop{
        padding: 20px;
      }
    }
  }
</style>