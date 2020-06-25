<template>
    <div class="progress-content">
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
                                align="center"
                                :show-overflow-tooltip="tableItem.overflow"
                                v-for="tableItem in tableItems"
                                :prop="tableItem.prop"
                                :label="tableItem.label"
                                :key="tableItem.label"
                                >
                                <template slot-scope="{row}">
                                    <span v-if="tableItem.tableId == 5">{{ row[tableItem.prop] | pigeonhole }}</span>
                                    <span v-else-if="tableItem.tableId == 7">{{row[tableItem.prop]==0?'未成卷':'已成卷'}}</span>
                                    <span v-else-if="tableItem.tableId == 10">
                                        {{ row[tableItem.prop.split('-')[0]]-row[tableItem.prop.split('-')[1]] }}
                                    </span>
                                    <span v-else>{{row[tableItem.prop]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="190"
                                align="center"
                                label="操作">
                                <template slot-scope="props">
                                    <el-button :disabled="disabled1" :loading="disabled1" @click="examineClick(props.row)" class="highlight-btn" size="small">查看进度</el-button>
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
                v-dialogDrag
                title="案件进度"
                :visible.sync="dialogVisible"
                width="34%"
                center>
                <span>
                    <div class="step-flex" style="height: 400px;">
                        <el-steps direction="vertical" style="height: 350px;"
                            :active="1" >
                            <!-- :active="progressList.anguan_confirm_time==null?'1':(progressList.dangan_accept_time==null?'2':'')" -->
                            <el-step status="finish" title="" description="">
                                <template slot="title">是否办结：已办结</template>
                                <template slot="description">时间：{{progressList.overtime}}</template>
                            </el-step>
                            <el-step :status="progressList.anguan_confirm_time==null?'wait':'finish'" title="" description="">
                                <template slot="title">案件审查：{{progressList.anguan_confirm_time==null?"未审查":"已审查"}}</template>
                                <template v-if="progressList.anguan_confirm_time==null?false:true"  slot="description">时间：{{progressList.anguan_confirm_time}}</template>
                            </el-step>
                            <el-step :status="progressList.dangan_accept_time==null?'wait':'finish'" title="" description="">
                                <template slot="title">档案接收：{{progressList.dangan_accept_time==null?"未接收":"已接收"}}</template>
                                <template v-if="progressList.dangan_accept_time==null?false:true"  slot="description">时间：{{progressList.dangan_accept_time}}</template>
                            </el-step>
                            <el-step :status="progressList.stock_status=='none'?'wait':'finish'" title="" description="">
                                <template slot="title">是否上架：{{progressList.stock_status=="none"?"未上架":"已上架"}}</template>
                                <template v-if="progressList.stock_status=='none'?false:true"  slot="description">时间：{{progressList.gdrq}}</template>
                            </el-step>
                        </el-steps>
                    </div>
                </span>
                <span slot="footer" class="dialog-footer">
                    <!-- <el-button type="primary" @click="dialogVisible = false">调 取</el-button> -->
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
           
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { setTimeout } from 'timers';

    export default {
        components: { Search },
        data()  {
            return  {
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                selectOption:{},
                activeName: "0",
                activeName2:"",
                tabItems:[],
                tableData:[],
                badgeList:[],
                tableItems:[
                    {label: "统一受案号", prop: "case_bh", tableId:1},
                    {label: "案件名称", prop: "case_name", tableId:2},
                    {label: "案件类型", prop: "case_type_name", tableId:3},
                    {label: "案件描述", prop: "case_desc", overflow: true, tableId:4},
                    {label: "是否归档", prop: "time_status", tableId:5},
                    {label: "承办人", prop: "case_take_user_name", tableId:6},
                    {label: "是否成卷", prop: "chengjuan", tableId:7},
                    {label: "总案卷数", prop: "total_quantity", tableId:8},
                    {label: "在库案卷数", prop: "in_quantity", tableId:9},
                    {label: "待入库案卷数", prop: "total_quantity-in_quantity", tableId:10},
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

                },
                disabled1:false,
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
                    if(this.activeName2!=''){
                        this.activeName = this.activeName2;
                    }else{
                        this.activeName = res.data.list[0].case_type_id;
                    }
                    // this.activeName = res.data.list[0].case_type_id;
                    this.getDataList();
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
            
            // 默认数据列表
            async getDataList(){
                // console.log({...this.seatchData})
                this.tableLoading = true;
                let dataInfo = { ...this.seatchData }
                dataInfo ['pageNum'] = this.currentPage1;
                dataInfo ['pageSize'] = this.pageSize;
                dataInfo ['case_type_id'] = this.activeName;
                
                const resultData = await this.$api.getProgressCase(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                    this.tableLoading = false;

                }
            },
            comfirmSearch(data){
                // console.log(data)
                this.$nextTick(()=>{ for(let key in data) { this.seatchData[key] = data[key] } })
                this.getCaseType(this.seatchData);
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                // console.log(tab, event);
                this.activeName2 = this.activeName;
                this.getDataList(this.seatchData);
            },
            
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList(this.seatchData);
            },
            
            // 小弹窗
            examineClick(res){ 
                // this.disabled1 = true;
                this.dialogVisible = true;
                this.progressList = res;
                // setTimeout(()=>{
                //     this.disabled1 = false;
                // },200)

            },
            
        },
    }
</script>

<style lang="scss" scoped>
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .progress-content{
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
            .pagination{
                margin-top: 20px;
                display: flex;
                justify-content: center;
                
            }
            .tab-pane-position {
                position: relative;
            }
            .tab-badge-num{
                position: absolute;
                top: -2px;
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
