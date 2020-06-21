<template>
  <div class="editRoutesPage">
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" label="权限组名称" prop="group_name"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row.group_name)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" title="修改权限配置">
      <el-form :model="role" label-width="100px" label-position="left">
        <el-form-item label="权限组名称">
          <el-input v-model="role.group_name" placeholder="请输入权限组名称" style="width:auto"/>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree ref="tree" :check-strictly="checkStrictly"
            :data="routesData" :props="defaultProps"
            show-checkbox node-key="name" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confrimBtn">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
import { getToken } from '@/utils/auth'
import { filterAsyncRoutes_respones,checkedNullInfo_respones } from '@/store/modules/permission'

export default {
  data() {
    return {
      role: {
        vue_role_id: '',
        group_name: '',
        routes: []
      },
      routes: [],
      rolesList: [],
      dialogVisible: false,
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: "name"
      }
    }
  },
  computed: {
    ...mapGetters(['base_url']),
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getDefaultRoutes()
    this.getRoutesGroup()
  },
  methods: {
    // 获取默认路由列表
    async getDefaultRoutes() {
        const resultData = await this.$api.getDefaultRoutes()
        console.log(resultData.data)
        let accessedRoutes;
        const accessedRoute = checkedNullInfo_respones(resultData.data)
        accessedRoutes = filterAsyncRoutes_respones(accessedRoute,true)
        this.routes = accessedRoutes
    },
    // 获取权限组列表
    async getRoutesGroup() {
      const resultData = await this.$api.getRoutesGroup()
      if(resultData && resultData.code == '0') this.rolesList = resultData.data
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    async handleEdit(group_name) {
      this.dialogVisible = true
      this.checkStrictly = true
      let resultData = await this.$api.getRoutesData({group_name})
      let accessedRoutes = []
      if(resultData.data.length>0) {
        const accessedRoute = checkedNullInfo_respones(resultData.data[0].routes)
        accessedRoutes = filterAsyncRoutes_respones(accessedRoute,true)
        this.role.vue_role_id = resultData.data[0].vue_role_id
        this.role.group_name = resultData.data[0].group_name
      }
      this.$nextTick(() => {
        this.$refs.tree.setCheckedNodes(this.generateArr(accessedRoutes))
        this.checkStrictly = false
      })
    },
    editRouteFun(params){
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: this.base_url+'/vueRoleUpdate',
          data: params,
          headers: { 'kf-token': getToken() },
        }).then(res=>{
          resolve(res.data)
        }).catch(error => reject(error) )
      })
    },
    generateTree(routes, checkedKeys) {
      const res = []
      for (const route of routes) {
        const routeName = route.name
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, checkedKeys)
        }
        if (checkedKeys.includes(routeName) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confrimBtn(){
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        this.role.routes = this.generateTree(this.routes, checkedKeys)
        console.log(this.role)
        const resultData = await this.editRouteFun(this.role)
        if(resultData && resultData.code =='0') {
          this.dialogVisible = false;
          this.$message.success('操作成功')
        }
    }
  }
}
</script>

<style lang="scss" scoped>
.editRoutesPage {
    padding: 20px;
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
