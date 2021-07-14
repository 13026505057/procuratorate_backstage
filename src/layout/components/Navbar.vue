<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          {{ org_name+' : '+user_true_name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item v-if="org_id == '370211'" @click.native='toFileTurnOver'>进入档案移交管理</el-dropdown-item> -->
            <el-dropdown-item :divided="org_id == '370211'" @click.native='updateinfo'>修改个人信息</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">
                <span style="display:block;">退出</span>
            </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog v-dialogDrag title="修改个人信息" :visible.sync="show"  >
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="部门名称">
            <el-select v-model="form.dept_id" placeholder="请选择部门">
              <el-option  v-for= 'item in list' :key= 'item.dept_id' :label="item.dept_name" :value="item.dept_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Submit">确定</el-button>
            <el-button type="primary" @click="show = false">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import md5 from 'js-md5';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'org_name',
      'device',
      'user_true_name',
      'address_id',
      'org_id',
      'username'
    ])
  },
  data(){
    return{
      show:false,
      list:[],
      form: {
        dept_id: '',
        password: ''
      }
    }
  },
    mounted(){
        // console.log(this.username,"============")
    },
  methods: {
    //提交修改表单
    Submit(){
      let passwordmd5 =this.form.password.length == 0? 12: md5.hex(this.form.password);
      this.$api.updateinfo(this.form.dept_id,passwordmd5).then(res=>{
           if(res.code == 0){
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.show = false
           }
      })
    },
    updateinfo(){
      this.show = true
    //   console.log('修改')

      let id = {org_id:this.org_id}
      this.$api.bmlist(id).then(res=>{
            if(res.code == 0){
              this.list = res.data
            }
      })
    },
    // 进入档案移交页面
    toFileTurnOver(){
        // window.open("http://124.70.182.101:10080/dist/#/index?username="+this.username)
        window.location.href = "http://141.113.104.230:8082/dist/#/login?username="+this.username
        // console.log("http://124.70.182.101:10080/dist/#/index?username="+this.username)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        font-size: 16px;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
