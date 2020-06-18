<template>
    <div class="record-content">
        <!-- <div class="search-box">
            <el-input class="search-inp" v-model="input" placeholder="请输入内容"></el-input>
            <el-button>查询</el-button>
        </div> -->
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch"/>
        <div class="head-tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab-pane-position" v-for="tabItem in tabItems" :key="tabItem.itemId" :name="tabItem.itemId">
                    <span slot="label">
                        {{tabItem.label}}
                        <el-badge :value="tabItem.badge" v-if="tabItem.badge == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
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
                                    <el-button @click="examineClick" class="highlight-btn" size="small">案件进度</el-button>
                                    <el-button @click="detailsClick" class="ash-btn" size="small">未完成</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination
                            background
                            @size-change="handleSizeChange1"
                            @current-change="handleCurrentChange1"
                            :current-page.sync="currentPage1"
                            :page-size="pageSize"
                            layout="prev, pager, next, jumper"
                            :total="total1">
                        </el-pagination>
                        <div @click="handleCurrentChange1" class="page-change">确定</div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <el-dialog
                title="案件进度"
                :visible.sync="dialogVisible"
                width="34%"
                center
                :custom-class="customClass">
                <span>
                    <div class="step-flex" style="height: 400px;">
                        <el-steps direction="vertical" :active="1">
                            <el-step v-for="stepItem in stepItems" :title="stepItem.title" :description="stepItem.description" :key="stepItem.itemId"></el-step>
                        </el-steps>
                    </div>
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">调 取</el-button>
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="案卷详情"
                :visible.sync="dialogVisibleDetails"
                width="56%"
                center>
                <span>
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
                                    <el-button class="highlight-btn" size="small">案件进度</el-button>
                                    <el-button class="ash-btn" size="small">未完成</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination
                            background
                            @size-change="handleSizeChange2"
                            @current-change="handleCurrentChange2"
                            :current-page.sync="currentPage1"
                            :page-size="pageSize"
                            layout="prev, pager, next, jumper"
                            :total="total2">
                        </el-pagination>
                        <div @click="handleCurrentChange2" class="page-change">确定</div>
                    </div>
                </span>
                <!-- <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">调 取</el-button>
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span> -->
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    export default {
        components: { Search },
        data()  {
            return  {
                input:'',
                activeName: "0",
                addSearch: [
                    { dom: 'eac11', value: '',placeholder: '请选择年份', itemId: 5, name: 'input' },
                    { dom: 'eac1112312312', value: '',placeholder: '请选择nhniodash', itemId: 6, name: 'input' },
                    { dom: 'eac11123', value: '',placeholder: '请选择年份', itemId: 7, name: 'select' },
                ],
                selectOption: {
                    eac11123: [
                        { value: 1,label:'1' } ,
                        { value: 2,label:'232' } ,
                        { value: 3,label:'3' } ,
                    ]
                },
                tabItems:[{
                        itemId:"0",
                        label:"侦监业务",
                        badge:"11"
                    },{
                        itemId:"1",
                        label:"公诉业务",
                        badge:"0"
                    },{
                        itemId:"2",
                        label:"民诉业务",
                        badge:"223"
                    },{
                        itemId:"3",
                        label:"公益业务",
                        badge:"44"
                    }
                ],
                tableItems:[{
                        label: "日期",
                        prop: "date"
                    },{
                        label: "姓名",
                        prop: "name"
                    }
                ],
                tableData: [{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    },{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    },{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    },{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    },{
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }
                ],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                currentPage1:1,
                currentPage2:1,
                total1:1000,
                total2:1000,
                pageSize:10,
                dialogVisible:false,
                customClass:'customClass',
                stepItems:[{
                    title:"步骤 1",
                    description: "这是一段很长很长很长的描述性文字",
                    itemId: 1
                },{
                    title:"步骤 1",
                    description: "这是一段很长很长很长的描述性文字",
                    itemId: 2
                },{
                    title:"步骤 1",
                    description: "这是一段很长很长很长的描述性文字",
                    itemId: 3
                },],
                dialogVisibleDetails:false,

            }
        },
        mounted(){

        },
        methods: {
            comfirmSearch(data){
                console.log(data,11111)
                },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                console.log(tab, event);
            },
            // 页面分页
            handleSizeChange1(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
            },
            // 弹窗分页
            handleSizeChange2(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange2(val) {
                console.log(`当前页: ${val}`);
            },
            // 小弹窗
            examineClick(){
                this.dialogVisible = true;
            },
            // 大弹窗
            detailsClick(){
                this.dialogVisibleDetails = true;
            },
        }

    }
</script>
<style lang="scss">
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .record-content{
        margin: 20px;
    }
    .search-box{
        border: 2px solid #97cfff;
        height: 82px;
        background-color: #eaf5ff;
        display: flex;
        .search-inp,button {
            margin: 23px 30px;
        }
        .search-inp{
            width: 270px;
        }
        input{
            border-radius: 8px;
            border: 1px solid #6db4ff;
        }
        button{
            width:94px;
            height: 38px;
            background-image: $gradual-color;
            color: #ffffff;
            border: none;
            font-size: 19px;
            border-radius: 8px;
        }
    }
    .head-tab{
        margin-top: 30px;
        .table-dataList{
            height: 560px;
            // overflow-y: auto;
            .highlight-btn,.ash-btn{
                font-size: 14px;
                color: #ffffff;
                border: none;
            }
            .highlight-btn{
                background-color: #6cb5ff;
                
            }
            .ash-btn{
                background-color: #d1d1d1;
            }
        }
        .pagination{
            margin-top: 40px;
            display: flex;
            justify-content: center;
            .page-change{
                height: 28px;
                line-height: 28px;
                font-size: 13px;
                margin: 2px 5px;
                padding: 0px 6px;
                background-image: $gradual-color;
                color: #ffffff;
                border-radius: 4px;
                cursor: pointer;
            }
        }
        .tab-pane-position {
            position: relative;
        }
        .tab-badge-num{
            position: absolute;
            top: -2px;
        }
        .customClass{
            // background-color: #47ccff;
        }
        .step-flex{
            display: flex;
            justify-content: center;
            overflow-y: auto;
        }
        .dialog-footer button{
            margin: 0 60px;
        }
    }
 
    
</style>




