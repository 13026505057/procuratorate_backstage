<template>
    <div class="unCompleted-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
        <div class="head-tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab-pane-position" v-for="tabItem in tabItems" :key="tabItem.case_type_id" :name="tabItem.case_type_id" >
                    <span slot="label">
                        {{tabItem.case_type_name}}
                        <el-badge :value="tabItem.contNum" v-if="tabItem.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table
                            v-loading="tableLoading"
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
                                :show-overflow-tooltip="tableItem.overflow"
                                align="center"
                                v-for="tableItem in tableItems"
                                :prop="tableItem.prop"
                                :label="tableItem.label"
                                :key="tableItem.label"
                                >
                                <template slot-scope="{row}">
                                    <span v-if="tableItem.tableId == 4">
                                        {{row[tableItem.prop]== 'in'?'已入库':'待入库'}}
                                    </span>
                                    <span v-else-if="tableItem.tableId == 5">{{row[tableItem.prop]==1?'超期':'未超期'}}</span>
                                    <span v-else-if="tableItem.tableId == 7">{{ row[tableItem.prop] | pigeonhole }}</span>
                                    <span v-else-if="tableItem.tableId == 11">{{ row[tableItem.prop.split('-')[0]]-row[tableItem.prop.split('-')[1]] }}</span>
                                    <span v-else>{{row[tableItem.prop]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="190"
                                align="center"
                                label="操作">
                                <template slot-scope="props">
                                    <el-button @click="examineClick(props.row)" :disabled="disabled1" :loading="disabled1" class="highlight-btn" size="small">已有案卷</el-button>
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
                </el-tab-pane>
            </el-tabs>
            <el-dialog
                title="案卷详情"
                :visible.sync="dialogVisibleDetails"
                width="68%"
                center>
                <span>
                    <div class="table-dataList" >
                        <el-table
                            v-loading="tableLoading"
                            :data="tableData1"
                            :header-cell-style="headerRowStyle"
                            border
                            style="width: 100%"
                            @row-click="cellClick">
                            <el-table-column
                                align="center"
                                type="index">
                            </el-table-column>
                            <el-table-column
                                :show-overflow-tooltip="tableItem.overflow"
                                align="center"
                                v-for="tableItem in dialogTableItems"
                                :prop="tableItem.prop"
                                :label="tableItem.label"
                                :key="tableItem.label"
                                >
                                <template slot-scope="{row}">
                                    <span v-if="tableItem.tableId == 6" :class="row[tableItem.prop] == 'in'?'':'colorRed'">
                                        {{row[tableItem.prop] == 'in'?'已入库':'待入库'}}
                                    </span>
                                    <span v-else-if="tableItem.tableId == 7" :class="row[tableItem.prop] == '0'?'colorRed':''">
                                        {{row[tableItem.prop] == '0'?'失效':'有效'}}
                                    </span>
                                    <span v-else>
                                        {{row[tableItem.prop]}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="200"
                                align="center"
                                label="操作">
                                <template slot-scope="{ row }">
                                    <el-button @click="reprintClick(row.exhibit_id)" :disabled="disabled2" :loading="disabled2" class="highlight-btn" size="small">补打条码</el-button>
                                    <el-button @click="cancellation(row.exhibit_id)" :disabled="disabled3" :loading="disabled3" class="highlight-btn" size="small">作废</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <DialogPagin ref="dialogTablePagin" :tableData="tableData1_temporary" @dialogTablePagin="dialogTablePagin"/>
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
 import DialogPagin from '@/components/DialogPagin'
    import { setTimeout } from 'timers';

    export default {
        components: { Search,DialogPagin },
        data()  {
            return  {
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'anguan_pingcha_chaoqi', value: '',placeholder: '评查是否超期', itemId: 6, name: 'select' },
                ],
                selectOption:{
                    anguan_pingcha_chaoqi:[{value: '',label: '全部'}, 
                        {value: '1',label: '评查超期'}, 
                        {value: '0',label: '评查未超期'}
                    ],
                },
                activeName: "0",
                activeName2: "",
                tabItems:[],
                tableData:[],
                badgeList:[],
                tableItems:[
                    {label: "统一受案号", prop: "case_bh", tableId:1},
                    {label: "案件名称", prop: "case_name", tableId:2},
                    {label: "案件类型", prop: "case_type_name", tableId:3},
                    // {label: "案件状态", prop: "stock_status", tableId:4},
                    {label: "案件描述", prop: "case_desc", overflow: true, tableId:6},
                    {label: "是否归档", prop: "time_status", tableId:7},
                    {label: "承办人", prop: "case_take_user_name", tableId:8},
                    {label: "总案卷数", prop: "total_quantity", tableId:9},
                    {label: "在库案卷数", prop: "in_quantity", tableId:10},
                    {label: "待入库案卷数", prop: "total_quantity-in_quantity", tableId:11},
                    {label: "评查是否超期", prop: "anguan_pingcha_chaoqi", tableId:5},

                ],
                dialogTableItems:[
                    {label: "条形码号", prop: "out_exhibit_id", tableId:1},
                    {label: "档号", prop: "dh", tableId:2},
                    {label: "卷号", prop: "jh", tableId:3},
                    {label: "卷宗名称", prop: "case_name", tableId:4},
                    {label: "案卷状态", prop: "stock_status", tableId:6},
                    {label: "是否有效", prop: "exhibit_status", tableId:7},
                    {label: "存放位置", prop: "cell_name", tableId:8},
                   
                ],
                dialogVisibleDetails:false,
                currentPage1:1,
                pageSize:10,
                total1:0,
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    timeYear:'',
                    case_name:'',
                    case_bh:'', //统一受案号
                    case_take_user_name:'',
                    anguan_pingcha_chaoqi:'',
                    cout_for: 'weigui',

                },
                total2:1,
                currentPage2:1,
                tableData1:[],
                tableData1_temporary: [],
                disabled1:false,
                disabled2:false,
                disabled3:false,
                tableLoading:false,

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
            this.getCaseType(this.seatchData);
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 分类&&角标
            getCaseType(seatchData){
                this.$api.getCaseType().then(async (res)=>{
                    this.tabItems = res.data.list;
                    console.log(this.activeName)
                    if (this.activeName2 != '') {
                        this.activeName = this.activeName2
                    }else{
                        this.activeName = res.data.list[0].case_type_id;
                    }
                    console.log(this.activeName)

                    this.getDataList(seatchData);
                    let dataInfo = { ...seatchData }
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
            // DialogPagin
            dialogTablePagin(data){
                console.log(data)
                this.tableData1 = data
            },
            // 默认数据列表
            async getDataList(seatchData){
                this.tableLoading = true;
                let dataInfo = { ...seatchData }
                dataInfo ['pageNum'] = this.currentPage1;
                dataInfo ['pageSize'] = this.pageSize;
                dataInfo ['case_type_id'] = this.activeName;
                const resultData = await this.$api.getUndocumented(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                    this.tableLoading = false;
                }
            },
            // 查询
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data) { this.seatchData[key] = data[key] } })
                this.getCaseType(this.seatchData);
            },
            // 补打条码
            async reprintClick(exhibit_id){
                this.disabled2 = true;
                setTimeout(()=>{ this.disabled2 = false; },2000)
                const resultData = await this.$api.printAgain({exhibit_id});
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求');
                this.getCaseType(this.seatchData)
            },
            // 作废
            async cancellation(exhibit_id){
                this.disabled3 = true;
                setTimeout(()=>{ this.disabled3 = false; },2000)
                const resultData = await this.$api.editCaseData({exhibit_id,exhibit_status:'0'});
                if(resultData && resultData.code == '0') this.$message.success('操作成功')
                this.getCaseType(this.seatchData)

            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            cellClick(row, event, column){
                console.log(row, event, column)
            },
            // 标签页
            handleClick(tab, event) {
                console.log(tab, event);
                this.activeName2 = this.activeName;
                this.getDataList(this.seatchData);
            },
            // 页面分页
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList(this.seatchData);
            },
            
            // 大弹窗
            examineClick(res){ 
                console.log(res)
                this.disabled1 = true;
                this.dialogVisibleDetails = true;
                this.tableData1_temporary = res.exhibits
                this.$nextTick(() => {
                    this.$refs.dialogTablePagin.dialogTablePagin(1)
                })
                setTimeout(()=>{
                    this.disabled1 = false;
                },2000)
            },
            
        },
    }
</script>
<style lang="scss" scoped>
    
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .unCompleted-content{
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
            .check-all button{
                background-image: $gradual-color; 
                color: #ffffff;
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
            .colorRed{
                color: #ff0000;
            }
        }
    }
</style>


