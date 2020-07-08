<template>
   <div class="homePage">
     <el-tabs v-model="showModel.activeNameTab" class="tabs_chart">
        <el-tab-pane class="tab-pane-position" v-for="(item,index) in chart_iframe" :key="item.sys_iframe_id" 
          :name="String(index)" :label="item.sys_iframe_name">
          <iframe class="iframe_class" :src="item.sys_iframe_url" frameborder="0"></iframe>
        </el-tab-pane>
      </el-tabs>
   </div>
</template>

<script>
import { mapActions,mapGetters } from 'vuex'
import router from '@/router'
import store from '@/store'
import { setToken } from '@/utils/auth'
export default {
  data(){
    return {
      showModel: {
        activeNameTab: "0",
      }
    }
  },
  computed: {
    ...mapGetters(['chart_iframe'])
  },
  mounted(){
    this.accordUrlLogin();
  },
  methods: {
    ...mapActions({'setTokenData':'user/setTokenData'}),
    async accordUrlLogin(){
      const RouteQuery = this.$route.query;
      if(Object.keys(RouteQuery).length>0) {
        let resultData = await this.$api.commonIsLogin({ username: RouteQuery.userName, org_id: RouteQuery.orgId })
        this.setTokenData(resultData.data.token)
        const roles = await store.dispatch('user/getInfo')
        await store.dispatch('settings/sysIframeGet')
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
      }
    }
  }
}
</script>

<style lang="scss">
  .homePage{
    .tabs_chart{
      height: 100%;
      width: 100%;
      .el-tabs__content{
        height: calc(100% - 55px);
        .tab-pane-position{
          height: 100%;
          width: 100%;
        }
      }
    }
    .iframe_class{
      width: 100%;
      height: 100%;
    }
  }
</style>