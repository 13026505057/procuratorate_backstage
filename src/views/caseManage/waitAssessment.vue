<template>
    <div class="wait-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
        <div class="head-tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab-pane-position" v-for="tabItem in tabItems" :key="tabItem.case_type_id" :name="tabItem.case_type_id" >
                    <span slot="label">
                        {{tabItem.case_type_name}}
                        <el-badge :value="tabItem.contNum" v-if="tabItem.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table
                            ref="multipleTable"
                            height="560"
                            :data="tableData"
                            :header-cell-style="headerRowStyle"
                            border
                            @selection-change="handleSelectionChange"
                            style="width: 100%">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                type="index">
                            </el-table-column>
                            <el-table-column
                                show-overflow-tooltip
                                align="center"
                                v-for="tableItem in tableItems"
                                :prop="tableItem.prop"
                                :label="tableItem.label"
                                :key="tableItem.label"
                                >
                                <template slot-scope="{row}">
                                    <span v-if="tableItem.tableId == 5">{{ row[tableItem.prop] | pigeonhole }}</span>
                                    <span v-else-if="tableItem.tableId == 7">{{row[tableItem.prop]==0?'未成卷':'已成卷'}}</span>
                                    <span v-else-if="tableItem.tableId == 10">

                                    </span>
                                    <span v-else>{{row[tableItem.prop]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="190"
                                align="center"
                                label="操作">
                                <template slot-scope="props">
                                    <el-button @click="examineClick(props.row)" class="highlight-btn" size="small">查看进度</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div style="margin-top: 20px">
                            <el-button @click="toggleSelection(tableData)">全选</el-button>
                            <el-button @click="toggleSelection()">取消选择</el-button>
                        </div>
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
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'

    export default {
        components: { Search },
        data()  {
            return  {
                addSearch: [
                    { dom: 'undertaker', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'exceed', value: '',placeholder: '评查是否超期', itemId: 6, name: 'select' },
                ],
                selectOption:{
                    exceed:[{value: '',label: '全部'}, 
                        {value: '1',label: '评查超期'}, 
                        {value: '0',label: '评查未超期'}
                    ],
                },
                activeName: "0",
                tabItems:[],
                tableData:[{
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
                    }],
                badgeList:[],
                tableItems:[
                    {label: "统一受案号", prop: "case_bh", tableId:1},
                    {label: "案件名称", prop: "case_name", tableId:2},
                    {label: "案件类型", prop: "case_type_name", tableId:3},
                    {label: "案件描述", prop: "case_desc", tableId:4},
                    {label: "是否归档", prop: "time_status", tableId:5},
                    {label: "承办人", prop: "case_take_user_name", tableId:6},
                    {label: "是否成卷", prop: "chengjuan", tableId:7},
                    {label: "总案卷数", prop: "total_quantity", tableId:8},
                    {label: "在库案卷数", prop: "in_quantity", tableId:9},
                    {label: "待入库案卷数", prop: "", tableId:10},
                    // total_quantity-in_quantity

                ],
                dialogVisible:false,
                currentPage1:1,
                pageSize:10,
                total1:0,
                stepItems:[{
                    title:"是否办结：已办结",
                    description: "时间：overtime"
                }],
                 headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                progressList:{},
                seatchData: {
                    timeYear:'',
                    case_name:'',
                    case_bh:'', //统一受案号
                    case_take_user_name:'',
                    anguan_pingcha_chaoqi:'',
                },
                multipleSelection:[]

            }
           
        },
        filters:{
            pigeonhole(status){
                const statusList = {
                    in:"已归档",
                    in_jj_out:"已归档（交卷超期）",
                    in_rk_out:"已归档（入库超期）",
                    in_all_out:"已归档（双超期）",
                    none:"未归档",
                    none_jj_out:"未归档（交卷超期）",
                    none_rk_out:"未归档（入库超期）",
                    none_all_out:"未归档（双超期）",
                }
                return statusList[status]
            }
        },
        mounted(){
            this.getCaseType();
            // this.getCornerMark();
        },
        methods: {
            // 分类&&角标
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.tabItems = res.data.list;
                    this.activeName = res.data.list[0].case_type_id;
                    this.getDataList();
                    let dataInfo = { ...this.seatchData }
                    dataInfo['cout_for'] = 'yishenjie';
                    // dataInfo['anguan_pingcha_chaoqi'] = ;
                    
                    const resultData = await this.$api.getCornerMarkType(dataInfo);
                    this.badgeList = resultData.data;
                    Object.keys(resultData.data).map(item=>{
                        res.data.list.map((itemChild,index)=>{
                            // console.log(item,"_"+itemChild.case_type_id)
                            if("_"+itemChild.case_type_id == item) {
                                itemChild.contNum = resultData.data[item]
                                this.$set(this.tabItems[index],index,itemChild)
                            }
                        })
                    })
                })
                
            },
            
            // 默认数据列表
            async getDataList(){
                
                let dataInfo = { ...this.seatchData }
                dataInfo ['pageNum'] = this.currentPage1;
                dataInfo ['pageSize'] = this.pageSize;
                dataInfo ['case_type_id'] = this.activeName;
                const resultData = await this.$api.getAwaitEvaluation(dataInfo);
                if(resultData && resultData.code == '0') {
                    // this.tableData = resultData.data.list,
                    this.total1 = resultData.data.total
                }
            },
            comfirmSearch(data){
                console.log(data,11111)
                this.seatchData = {
                    timeYear:data.year,
                    case_name:data.name,
                    case_bh:data.num, //统一受案号
                    case_take_user_name:this.addSearch[0].value,
                    anguan_pingcha_chaoqi:this.addSearch[1].value,
                }
                this.getDataList();
                this.getCaseType();
            },
            toggleSelection(rows) {
                console.log(rows)
                let that = this;
                // this.$nextTick(function () {
                    if (rows) {
                        rows.forEach(row => {
                            console.log(that.$refs.multipleTable.toggleRowSelection(row))
                            // that.$refs.multipleTable.toggleRowSelection(row);
                        });
                    } else {
                        that.$refs.multipleTable.clearSelection();
                    }
                // })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                console.log(tab, event);
                this.getDataList();
            },
            // 页面分页
            handleSizeChange1(val) {
                console.log(`每页 ${val} 条`);
                this.getDataList();
            },
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            
            // 小弹窗
            examineClick(res){ 
                console.log(res)
                this.dialogVisible = true;
                this.progressList = res;
                // this.overtime = res.overtime;

            },
            
        },
    }
</script>
<style lang="scss">
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .wait-content{
        margin: 20px;
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
                margin-top: 20px;
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
    }
    
 
    
</style>

