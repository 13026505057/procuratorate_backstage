<template>
   <div class="homePage">
      <div :class="showDefalutMax?'showDefalutMax':''" class="tabs_chart">
        <svg-icon :icon-class="showDefalutMax?'exit-fullscreen':'fullscreen'" class="dialogBtn" @click="selectOpenDialog" />
        <el-tabs v-model="showModel.activeNameTab">
          <el-tab-pane class="tab-pane-position" v-for="(item,index) in chart_iframe" :key="item.sys_iframe_id" 
            :name="String(index)" :label="item.sys_iframe_name">
            <iframe class="iframe_class" :src="item.sys_iframe_url" frameborder="0"></iframe>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 删除页面
        {"path": "beforehandItem", "component": "views/archivesManage/checkArchives/beforehandItem", "name": "案件预入库 - BeforehandItem", "meta":{ "title":"案件预入库","icon": "icon-zhiliangpingcha" }},
       -->
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
      },
      showDefalutMax: false
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
    selectOpenDialog(){
      console.log(this.showDefalutMax)
      this.showDefalutMax = !this.showDefalutMax
    },
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
      &.showDefalutMax{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        background-color: #fff;
      }
      .dialogBtn{
        position: absolute;
        z-index: 1002;
        right: 20px;
        top: 10px;
      }
      .el-tabs--top{
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
    }
    .iframe_class{
      width: 100%;
      height: 100%;
    }
  }
</style>