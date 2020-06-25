<template>
    <div class="unit-content">
        <!-- <div class="search-box"> -->
        <div class="head-search">
            <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
            <el-button @click="addUnitClick('add','')">新增人员</el-button>
        </div>
            
        <!-- </div> -->
        <div class="table-list">
            <div class="table-dataList" >
                <el-table
                    :data="tableData"
                    :header-cell-style="headerRowStyle"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        label="序号"
                        width="60"
                        type="index">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        v-for="tableItem in tableItems"
                        :prop="tableItem.prop"
                        :label="tableItem.label"
                        :key="tableItem.label"
                        >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="{ row }">
                            <el-button @click="addUnitClick('update',row)" class="ash-btn" size="small">修改</el-button>
                            <el-popconfirm
                                icon="el-icon-info"
                                iconColor="red"
                                title="确定删除吗？"
                                @onConfirm = "confirmDel"
                                >
                                <el-button slot="reference" @click="delUnitClick(row.user_id)" class="highlight-btn" size="small">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currentPage1"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total1">
                </el-pagination>
            </div>
             <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="34%"
                center>
                <span>
                    <el-form ref="form" :model="unit_form" label-width="80px">
                        <el-form-item :label="formItem.name" v-for="formItem in formItems" :key="formItem.formId">
                            <el-input v-model="unit_form[formItem.inp]" :show-password="formItem.formId == '1'?true:false"></el-input>
                        </el-form-item>
                        <el-form-item label="部门">
                            <el-select v-model="unit_form.dept_ids" multiple clearable placeholder="请选择" style="width:100%">
                                <el-option
                                    v-for="item in deptOptions"
                                    :key="item.dept_id"
                                    :label="item.dept_name"
                                    :value="item.dept_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="职位">
                            <el-select v-model="unit_form.position_ids" multiple clearable placeholder="请选择" style="width:100%">
                                <el-option
                                    v-for="item in positionData"
                                    :key="item.position_id"
                                    :label="item.position_name"
                                    :value="item.position_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色">
                            <el-select v-model="unit_form.role_ids" multiple clearable placeholder="请选择" style="width:100%">
                                <el-option
                                    v-for="item in groupOptions"
                                    :key="item.role_id"
                                    :label="item.role_name"
                                    :value="item.role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限设置">
                            <el-select v-model="unit_form.vue_role_ids" clearable placeholder="请选择" style="width:100%">
                                <el-option
                                    v-for="item in routesGroupsArr"
                                    :key="item.vue_role_id"
                                    :label="item.group_name"
                                    :value="item.vue_role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>  
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-popconfirm
                        :title="popconfirmTitle"
                        @onConfirm="confirmClick"
                        >
                        <!-- <el-button>删除</el-button> -->
                        <el-button slot="reference" type="primary" @click="confirmAddUnit">确 定</el-button>
                    </el-popconfirm>
                    <!-- <el-button type="primary" @click="confirmAddUnit">确 定</el-button> -->
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import md5 from 'js-md5';
    import { mapGetters } from 'vuex'
    
    export default {
        components: { Search },
        data()  {
            return  {
                addSearch: [
                    { dom: 'dept_id', value: '',placeholder: '请选择部门', itemId: 1, name: 'select' },
                    { dom: 'user_true_name', value: '',placeholder: '请输入姓名', itemId: 2, name: 'select' },
                ],
                selectOption:{
                    dept_id: [],
                    user_true_name: []
                },
                tableItems:[
                    { label: "账号",  prop: "username" },
                    { label: "人员名称",  prop: "user_true_name" },
                    { label: "单位", prop: "org_name" ,},
                    { label: "创建时间", prop: "create_time" ,},
                ],
                tableData: [],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                currentPage1:1,
                total1:1,
                pageSize:10,
                dialogVisible:false,
                dialogTitle:'',
                unit_form:{
                    username:'',
                    password:'',
                    user_true_name: '',
                    role_ids:[], 
                    position_ids:[], 
                    dept_ids:[],
                    vue_role_ids: ''
                },
                formItems:[
                    { name:'账号', inp:'username', formId:'0'},
                    { name:'密码', inp:'password', formId:'1' },
                    { name:'真实姓名', inp:'user_true_name', formId:'2' }
                ],
                deptOptions:[],
                groupOptions:[],
                positionData:[],
                type:'',
                position_id:'',
                popconfirmTitle:'',
                props: { multiple: true },
                // jurisdictionOptions:[]
                userName:'',
                routesGroupsArr: [],
                seatchData: {
                    user_true_name: '',
                    dept_id: ''
                }
            }
        },
        mounted(){
            this.getDataList();
            this.getDeptList();
            this.getGroupList();
            this.getPositionList();
            this.getRoutesGroupsList();
        },
        methods: {
           
            receivedAddress(data){
                console.log(data)
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data) { this.seatchData[key] = data[key] } this.getDataList();})
                
            },
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize,
                    ...this.seatchData }
                const resultData = await this.$api.getPersonnelList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                }
            },
            // 查部门
            async getDeptList(){
                const dataInfo = {pageNum:1,pageSize:1000}
                const resultData = await this.$api.getDepartmentList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.deptOptions = resultData.data.list;
                    var arr = [];
                    resultData.data.list.map(item=>{
                        arr.push({
                            label:item.dept_name,
                            value:item.dept_id
                        })
                    })
                    this.selectOption.dept_id = arr
                }
            },
            // 查职位
            async getPositionList(){
                const dataInfo = {pageNum:1,pageSize:1000}
                const resultData = await this.$api.getPositionList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.positionData = resultData.data.list;
                }
            },
            // 获取路由权限组列表
            async getRoutesGroupsList(){
                const dataInfo = {pageNum:1,pageSize:100}
                const resultData = await this.$api.getRoutesData(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.routesGroupsArr = resultData.data;
                }
            },
            // 查角色
            async getGroupList(){
                const dataInfo = {pageNum:1,pageSize:2000};
                const resultData = await this.$api.getRoleList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.groupOptions = resultData.data.list;
                }
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
           
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            searchClick(){
                this.getDataList();
            },
            // 新增
            addUnitClick(type,row_user_id){
               console.log(row_user_id)
                this.dialogVisible = true;
                this.type = type;
                this.user_id = row_user_id.user_id;
                this.unit_form.username = '';
                this.unit_form.password = 'admin';
                this.unit_form.user_true_name = '';
                this.unit_form.vue_role_ids = '';
                this.unit_form.role_ids = [];
                this.unit_form.position_ids = [];
                this.unit_form.dept_ids = [];
                if(type == "add"){
                    this.dialogTitle = "新增人员";
                }else{
                    this.dialogTitle = "修改人员"
                    this.unit_form.username = row_user_id.username;
                    this.unit_form.password = 'admin';
                    this.unit_form.user_true_name = row_user_id.user_true_name;
                    if(row_user_id.userVueRoleList.length>0) this.unit_form.vue_role_ids = row_user_id.userVueRoleList[0].vue_role_id
                    

                    // this.unit_form.position = row_user_id.userPositions;
                     console.log(row_user_id.userDepts)

                    row_user_id.userDepts.map(item=>{
                        this.unit_form.dept_ids.push(item.dept_id);
                    })
                    row_user_id.userPositions.map(item=>{
                        this.unit_form.position_ids.push(item.position_id)
                    })
                    row_user_id.userRoleList.map(item=>{
                        this.unit_form.role_ids.push(item.role_id)
                    })
                    
                }
            },
            // 新增&&修改
            async confirmAddUnit(){
                if(this.type == "add"){
                    this.popconfirmTitle = "确定新增吗"
                }else{
                    this.popconfirmTitle = "确定修改吗"
                }
            },
            async confirmClick(){
                console.log(this.unit_form)
                this.unit_form.dept_ids = this.unit_form.dept_ids.join(',');
                this.unit_form.position_ids = this.unit_form.position_ids.join(',');
                this.unit_form.role_ids = this.unit_form.role_ids.join(',');
                const dataInfo = { ...this.unit_form };
                dataInfo.password = md5.hex(this.unit_form.password)
                if(this.type == "add"){
                    const resultData = await this.$api.addPersonnel(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }else{
                    dataInfo['user_id'] = this.user_id;
                    const resultData = await this.$api.updatePersonnel(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }
                this.getDataList();
            },
            // 删除
            delUnitClick(user_id){
                this.user_id = user_id
            },
            async confirmDel(){
                const dataInfo = {user_id: this.user_id}
                const resultData = await this.$api.deletePersonnel(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                this.getDataList();
            },
        }

    }
</script>
<style lang="scss" scoped>
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .unit-content{
        margin: 20px;
        
        .head-search{
            position: relative;
            button{
                // width:94px;
                height: 38px;
                background-image: $gradual-color;
                color: #ffffff;
                border: none;
                font-size: 17px;
                border-radius: 8px;
                position: absolute;
                right: 10px;
                top: 15px;
            }
        }
        .table-list{
            .table-dataList{
                margin-top: 20px;
                .highlight-btn,.ash-btn{
                    font-size: 14px;
                }
                .highlight-btn{
                    background-color: #6cb5ff;
                    color: #ffffff;
                    border: none;
                }
                .ash-btn{
                    // background-color: #d1d1d1;
                }
            }
            
            .pagination{
                margin-top: 30px;
                display: flex;
                justify-content: center;
            }
        
        }
            
    }
</style>
