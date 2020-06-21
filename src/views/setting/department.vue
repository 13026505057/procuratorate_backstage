<template>
    <div class="overall-content unit-content">
        <div class="search-box">
            <div>部门列表</div>
            <el-button @click="addUnitClick('add','')">新增部门</el-button>
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
                                <el-button slot="reference" @click="delUnitClick(row.dept_id)" class="highlight-btn" size="small">删除</el-button>
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
                        <el-form-item label="部门名称">
                            <el-input v-model="unit_form.dept_name"></el-input>
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
        computed:{
            ...mapGetters(['org_id'])
        },
        data()  {
            return  {
                tableItems:[
                    { label: "部门名称",  prop: "dept_name" },
                    // { label: "创建者", prop: "dept_create_user_name" ,},
                    { label: "创建时间", prop: "dept_create_time" ,},
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
                    dept_name: '',
                    org_id: '',
                },
                type:'',
                dept_id:'',
                popconfirmTitle:'',

            }
        },
        mounted(){
            this.unit_form.org_id = this.org_id
            this.getDataList();
        },
        methods: {
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize,org_id:this.unit_form.org_id}
                const resultData = await this.$api.getDepartmentList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                }
            },
            
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
           
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            // 新增
            addUnitClick(type,row_dept_id){
                this.dialogVisible = true;
                this.type = type;
                this.dept_id = row_dept_id.dept_id;
                if(type == "add"){
                    this.dialogTitle = "新增部门";
                    this.unit_form = {
                        dept_name :'',
                    }
                }else{
                    this.dialogTitle = "修改部门"
                    this.unit_form.dept_name = row_dept_id.dept_name;
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
                const dataInfo = { ...this.unit_form }
                if(this.type == "add"){
                    const resultData = await this.$api.addDepartment(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }else{
                    dataInfo['dept_id'] = this.dept_id;
                    console.log(dataInfo)
                    const resultData = await this.$api.updateDepartment(dataInfo);
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
            delUnitClick(dept_id){
                this.dept_id = dept_id
            },
            async confirmDel(){
                const dataInfo = {dept_id: this.dept_id}
                const resultData = await this.$api.deleteDepartment(dataInfo);
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
