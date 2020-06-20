<template>
    <div class="unit-content">
        <div class="search-box">
            <div>单位列表</div>
            <el-button @click="addUnitClick">新增单位</el-button>
        </div>
        <div class="table-list">
            <div class="table-dataList" >
                <el-table
                    height="560"
                    :data="tableData"
                    :header-cell-style="headerRowStyle"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
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
                        <template slot-scope="props">
                            <el-button @click="updateClick" class="ash-btn" size="small">修改</el-button>
                            <el-button @click="examineClick" class="highlight-btn" size="small">删除</el-button>
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
                        <el-form-item label="单位名称">
                            <el-input v-model="unit_form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="单位编号">
                            <el-input v-model="unit_form.name"></el-input>
                        </el-form-item>
                    </el-form>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    
    export default {
        
        data()  {
            return  {
                
                tableItems:[{
                        label: "单位名称",
                        prop: "org_name"
                    },{
                        label: "单位编码",
                        prop: "org_code"
                    }
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

                }

            }
        },
        mounted(){
            this.getDataList();
        },
        methods: {
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize}
                const resultData = await this.$api.getUnitList(dataInfo);
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
            addUnitClick(){
                this.dialogVisible = true;
                this.dialogTitle = "新增单位"
            },
            // 修改
            updateClick(){
                // dialogVisible
            },
            // 小弹窗
            examineClick(){
                this.dialogVisible = true;
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
                margin-top: 40px;
                display: flex;
                justify-content: center;
            }
        
        }
            
    }
</style>
