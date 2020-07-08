<template>
  <div class="editRoutesPage">
    <el-button @click="addRole" type="search">新增</el-button>
    <el-button @click="editUpdateRoleFun(updateRole_temp)" type="search">更新路由表</el-button>
    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border :header-cell-style="headerRowStyle">
        <el-table-column align="center" type="index" label="#"></el-table-column>
      <el-table-column align="center" label="权限组名称" prop="group_name"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row.group_name)">修改</el-button>
          <el-button type="danger" size="small" @click="deleItem(row.vue_role_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-dialogDrag :visible.sync="dialogVisible" :title="showModel.dialogTitle" @close="resetRoutes">
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
import UpdateRole from '@/store/modules/routes'

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
      showModel: {
        dialogTitle: '',
        modelType: false, // true为修改 false为新增
      },
      checkStrictly: false,
      defaultProps: {
          children: 'children',
          label: "name"
      },
      headStyle:{
          backgroundColor: '#eaf5ff',
          borderTop: '1px solid #97cfff',
          borderBottom: '1px solid #97cfff',
          fontSize: '18px',
          color: '#2c2c2c'
      },
      // 更新路由表
      dialogVisible_role: false,
      updateRole_temp: UpdateRole
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
    // 更新路由表信息
    editUpdateRoleFun(params){
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: this.base_url+'/vueDefaultRouteAddList',
          data: params,
          headers: { 'kf-token': getToken() },
        }).then(res=>{
          if(res.code == '0') this.$message.success('更新完成')
          resolve(res.data)
        }).catch(error => reject(error) )
      })
    },
    async addRole(){
      this.dialogVisible = true;
      this.showModel.modelType = false;
      this.role.group_name = '';
      this.showModel.dialogTitle = '新增权限配置'
    },
    // 获取默认路由列表
    async getDefaultRoutes() {
        const resultData = await this.$api.getDefaultRoutes()
        let accessedRoutes;
        const accessedRoute = checkedNullInfo_respones(resultData.data)
        accessedRoutes = filterAsyncRoutes_respones(accessedRoute,true)
        this.routes = accessedRoutes
    },
    // 获取权限组列表
    async getRoutesGroup() {
      const resultData = await this.$api.getRoutesData()
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
      this.showModel.modelType = true
      this.showModel.dialogTitle = '修改权限配置'
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
    // 默认Tree树
    resetRoutes(){
      this.getDefaultRoutes()
      this.updateRole_temp = ''
    },
    // 权限组信息更改
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
    // 新增权限组信息
    addRouteFun(params){
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: this.base_url+'/vueRoleAdd',
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
    confrimBtn(){
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        const routesArr = [ ...this.routes ]
        this.role.routes = this.generateTree(routesArr, checkedKeys)
        if(this.showModel.modelType) this.editRouleItem()
          else this.addRouleItem()
    },
    // 编辑权限组
    async editRouleItem(){
      const resultData = await this.editRouteFun(this.role)
      if(resultData && resultData.code =='0') {
        this.dialogVisible = false;
        this.$message.success('操作成功')
        this.getRoutesGroup()
      }
    },
    // 新增权限组
    async addRouleItem(){
      const resultData = await this.addRouteFun(this.role)
      if(resultData && resultData.code =='0') {
        this.dialogVisible = false;
        this.$message.success('操作成功')
        this.getRoutesGroup()
      }
    },
    // 删除权限组
    async deleItem(vue_role_id){
      let resultData = await this.$api.delRoutesData({vue_role_id})
      if(resultData && resultData.code == '0') this.$message.success('操作成功')
    },
    headerRowStyle({row, rowIndex}){ 
        return this.headStyle
    },
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
