<template>
    <div>
      <div class='box'>
          <div v-if="org_id == '370200'" class="searchbox" style='width:500px'>
              <el-cascader ref="treeOrg" class="demonstration" placeholder="试试搜索：青岛市" v-model="selectOrgId" :options="org_list" style="400px"
                    :props="{ checkStrictly: true }" filterable clearable>
              </el-cascader> <el-button @click="search">查询</el-button>
          </div>
          <el-button type="success" @click="addpingcha">提交</el-button>
          <el-button type="danger" @click="restcasetyp" v-if="org_id == '370200'" >同步下级机构设置</el-button>  
          <div style="margin-left:30px;padding-top:10px"><img src="../../assets/login/gx.png" alt=""><span style="font-size:12px">不能一键评查</span></div>
      </div>  
      <el-tree
        v-loading="loading"
        ref="tree"
        :data="data"
        show-checkbox
        :props="defaultProps"
        @check-change="handleCheckChange"
          node-key="case_type_id"
        :default-expanded-keys="pingc"
        :default-checked-keys="pingc"
        >
         
      </el-tree>
      <!-- <div class="czbox" >
        <el-button type="success" @click="addpingcha">提交</el-button>
        <el-button type="danger" @click="restcasetyp" v-if="org_id == '370200'" >同步下级机构设置</el-button>      
      </div> -->
    </div>
</template>
<script>
 import { mapGetters } from 'vuex'
  export default {

    computed: {
        ...mapGetters(['org_list','org_id'])
    },

    data() {
      return {
        nowid:'',
        pingc:[],
        loading: true,
        selectOrgId:'',
        data: [],
        defaultProps: {
          children: 'caseTypes',
          label: 'case_type_name',

        },
        permissionIds:'',
        casetypst:'',
        pingcha:'',
      };
    },
    created(){
       this.gettype()
    },
    mounted(){
     
    },
    methods:{
      //提交 一键评查
      addpingcha(){
        let oid = this.nowid? this.nowid:this.org_id
        this.$api.addcasetype(this.permissionIds,oid).then(res=>{
          if(res.code == 0){
            this.gettype()
          }
          
        })
      },
      //多选重置
      restallcasetype(){
        this.$api.restallcasetype(this.permissionIds,this.org_id).then(res=>{
            console.log(res)
                 if(res.code == 0){
                    this.$message({
                      message: '删除成功',
                      type: 'success'
                    });
                    this.gettype()
                  }
        })
      },
      // 同步下级机构设置
      restcasetyp(){
        this.$api.restcasetype(this.permissionIds).then(res=>{
              console.log(res)
                   if(res.code == 0){
                      this.$message({
                        message: '同步成功',
                        type: 'success'
                      });
                      this.gettype()
                    }
        })
      },
      //删除某节点
      // delone(){
      //   if(this.casetypst.length>1){      
      //         this.$message({
      //           message: '只能够选择一个',
      //           type: 'warning'
      //         });        
      //   }else{
      //         if(this.pingcha == 0){
      //               let org_id = this.casetypst.split(',')[0]
      //               this.$api.delcasetype(org_id).then(res=>{
      //                   if(res.code == 0){
      //                     this.$message({
      //                       message: '删除成功',
      //                       type: 'success'
      //                     });
      //                     this.gettype()
      //                   }
      //               })
      //         }else{
      //           this.$message({
      //             message: '当前节点不能够被删除',
      //             type: 'warning'
      //           });
      //         }
       
      //   }
      // },
      search(){
          var str = this.selectOrgId.toString();
          var id = str.split(',')[str.split(',').length - 1]
          console.log('点击查询')
          console.log(id)
          this.nowid = id
          this.gettype()
      },
      handleCheckChange () {
          let res = this.$refs.tree.getCheckedNodes()
          let arr = []
          let casetyp = []
          let pingchas = []
          res.forEach((item) => {
            arr.push(item.case_type_id)
          })
          res.forEach((item) => {
            casetyp.push(item.case_type_org_id)
          })
          res.forEach((item) => {
            pingchas.push(item.can_easy_pingcha)
          })
          let menuArr = this.unique(arr); // 去除重复的节点
          let casetyps = this.unique(casetyp); // 去除重复的节点
          this.permissionIds = menuArr.join(',')
          this.casetypst = casetyps.join(',')
          this.pingcha = pingchas[0]
          // console.log(permissionIds.split(',')[0])
          
          

    },
    // 数组去重
    unique (arr) {
      let newArr = []
      let len = arr.length
      for (let i = 0; i < len; i++) {
        if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i])
        }
      }
      return newArr
    },
    //获取树形结构
    gettype(){
       this.pingc = []
        this.loading =  true
        console.log('当前部门')
        console.log(this.pingc)
        let ids = this.nowid? this.nowid:this.org_id
        // let ids = id? id:this.org_id
        this.$api.getcasetype(ids).then(res=>{
                        this.data = res.data                
                        for(var i=0; i<this.data.length;i++){
                           if(this.data[i].can_easy_pingcha == '0'){
                              this.pingc.push(this.data[i].case_type_id)
                           }
                           let arr = this.data[i].caseTypes
                           for(var j=0; j<arr.length;j++){
                              if(arr[j].can_easy_pingcha == '0'){
                                this.pingc.push(arr[j].case_type_id)
                              }
                           }
                        }
                        console.log( this.pingc)
                        this.loading =  false;
                        
                  })
              }
    },
 
  };
</script>
<style scoped>
.box{
  width: 98%;
  margin:0 auto;
  margin-top:10px;
  display: flex;
}
 .demonstration /deep/{
   width:400px;
 }
</style>

