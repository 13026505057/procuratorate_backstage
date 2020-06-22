<template>
    <div class="overall-content unit-content">
        <div class="search-box">
            <div>权限组列表</div>
            <el-button @click="addUnitClick('add','')">新增权限组</el-button>
        </div>
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
                                <el-button slot="reference" @click="delUnitClick(row.group_id)" class="highlight-btn" size="small">删除</el-button>
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
                    <el-form ref="form" :model="unit_form" label-width="120px">
                        <el-form-item label="权限组名称">
                            <el-input v-model="unit_form.group_name"></el-input>
                        </el-form-item>
                        <el-form-item label="权限">
                            <el-select 
                                v-model="unit_form.jurisdiction_url"
                                reserve-keyword filterable  multiple 
                                v-el-select-loadmore="loadmore"
                                clearable placeholder="请选择" style="width:100%">
                                <el-option
                                    v-for="item in jurisdictionOptions"
                                    :key="item.permission_id"
                                    :label="item.permission_url_name"
                                    :value="item.permission_id">
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
    import { mapGetters } from 'vuex'
    
    export default {
        directives: {
            'el-select-loadmore': {
                bind(el, binding) {
                    // 获取element-ui定义好的scroll盒子
                    const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
                    SELECTWRAP_DOM.addEventListener('scroll', function () {
                        /**
                        * scrollHeight 获取元素内容高度(只读)
                        * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                        * clientHeight 读取元素的可见高度(只读)
                        * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                        * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                        */
                        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                        if (condition) {
                            binding.value();
                        }
                    });
                }
            }
        },
        computed:{
            ...mapGetters(['org_id'])
        },
        data()  {
            return  {
                tableItems:[
                    { label: "权限组名称",  prop: "group_name" },
                    // { label: "创建者", prop: "dept_create_user_name" ,},
                    // { label: "创建时间", prop: "create_time" ,},
                    // { label: "所属部门", prop: "dept_total_name" ,},
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
                    group_name: '',
                    jurisdiction_url:[],
                    org_id: '',
                },
                jurisdictionOptions:[],
                formData: {
                    pageIndex: 1,
                    pageSize: 10,
                },
                type:'',
                group_id:'',
                popconfirmTitle:'',

            }
        },
        mounted(){
            this.unit_form.org_id = this.org_id
            this.getDataList();
            this.getJurisdictionOptions(this.formData);
        },
        methods: {
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize,org_id:this.unit_form.org_id}
                const resultData = await this.$api.getPermissionGroupList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                }
            },
            // 查权限
            async getJurisdictionOptions(formData){
                const dataInfo = {pageNum:formData.pageIndex,pageSize:formData.pageSize,neet_auth:'1',org_id:this.unit_form.org_id}
                const resultData = await this.$api.getJurisdictionList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.jurisdictionOptions = this.jurisdictionOptions.concat(resultData.data.list);
                }
            },
            loadmore() {
                this.formData.pageIndex++;
                this.getJurisdictionOptions(this.formData);
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
           
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            // 新增&&修改
            addUnitClick(type,row_group){
                this.dialogVisible = true;
                this.type = type;
                this.group_id = row_group.group_id;
                this.unit_form = {
                    group_name :'',
                    jurisdiction_url:[],
                }
                if(type == "add"){
                    this.dialogTitle = "新增权限组";
                    
                }else{
                    this.dialogTitle = "修改权限组"
                    this.unit_form.group_name = row_group.group_name;
                    // this.unit_form.jurisdiction_url = row_group.groupPermissionList;
                    row_group.groupPermissionList.map(item=>{
                        this.unit_form.jurisdiction_url.push(item.permission_id)
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
                console.log(this.unit_form.jurisdiction_url)
                const dataInfo = { group_name:this.unit_form.group_name,
                    permission_ids: this.unit_form.jurisdiction_url.join(','),
                    org_id:this.unit_form.org_id}
                if(this.type == "add"){
                    const resultData = await this.$api.addJurisdiction(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }else{
                    dataInfo['group_id'] = this.group_id;
                    const resultData = await this.$api.updateJurisdiction(dataInfo);
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
            delUnitClick(group_id){
                this.group_id = group_id
            },
            async confirmDel(){
                const dataInfo = {group_id: this.group_id,org_id:this.unit_form.org_id}
                const resultData = await this.$api.deleteJurisdiction(dataInfo);
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
        
        .search-box{
            border: 2px solid #97cfff;
            height: 70px;
            padding: 15px 0;
            background-color: #eaf5ff;
            display: flex;
            div,button{
                margin-left: 30px;
            }
            div{
               height: 38px;
               line-height: 38px; 
            }
            button{
                // width:94px;
                height: 38px;
                background-image: $gradual-color;
                color: #ffffff;
                border: none;
                font-size: 17px;
                border-radius: 8px;
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
