<template>
    <div class="inWarehousePage">
        <div class="scan-table">
            <span class="head-text">入库操作：</span>
            <el-radio-group v-model="exhibit_type" class="scan-select">
                <el-radio v-for="exhibitItem in exhibitType" :key="exhibitItem.exhibit_type_id" :label="exhibitItem.exhibit_type_code">{{exhibitItem.exhibit_type_name}}</el-radio>
            </el-radio-group>
            <el-input class="scan-input" v-model="stockNum" ref="stockNumRef" @change="stockNumChange" placeholder="扫描货架码"></el-input>
            <el-input class="scan-input" v-model="exhibitNum" ref="exhibitNumRef" @change="exhibitNumChange" placeholder="扫描案卷码"></el-input>
            <span class="head-text">先扫描货架码，光标自动移动到案卷码位置后在扫描案卷码</span>
        </div>
        <Search class="searchInfo" :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" @exportExcelFun="openExportExcelFun" :exportExcelBtn="true"/>
        <div class="head-tab">
            
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
                        label="统一受案号"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.case_bh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="案件名称"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.case_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="档号"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.dh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="卷号"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.jh}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="卷宗名称"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.exhibit_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="卷宗状态"
                        align="center">
                        <template slot-scope="props">
                            <span>待归还</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="借阅人"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.borrow_user_true_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="审批人"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.approve_user_true_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="借阅时间"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.borrow_begin_time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="归还时间"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.borrow_end_time}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        align="center"
                        show-overflow-tooltip
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
                        label="待入库案卷数"
                        align="center">
                        <template slot-scope="props">
                            <span>{{props.row.total_quantity-props.row.in_quantity}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="190"
                        align="center"
                        label="操作">
                        <template slot-scope="props">
                            <el-button :disabled="disabled1" :loading="disabled1" @click="examineClick(props.row)" class="highlight-btn" size="small">查看进度</el-button>
                        </template>
                    </el-table-column> -->
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
               
            <el-dialog v-dialogDrag
                title="案件进度"
                :visible.sync="dialogVisible"
                width="34%"
                center>
                <span>
                    <div class="step-flex" style="height: 400px;">
                        <el-steps direction="vertical" :active="1"  style="height: 350px;">
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
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed: {
            ...mapGetters(['base_url'])
        },
        data()  {
            return  {
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                exhibitType:[],
                selectOption:{},
                activeName: "0",
                tabItems:[],
                tableData:[],
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
                    // {label: "待入库案卷数", prop: "", tableId:10},
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
                exhibit_id:'',
                exhibit_type:'SS',
                progressList:{},
                seatchData: {
                    timeYear:'',
                    case_name:'',
                    case_bh:'', //统一受案号
                    case_take_user_name:'',

                },
                // scanData: {
                //     cell_id:'',
                //     exhibit_id:'',

                // },
                disabled1:false,
                stockNum:'',
                exhibitNum:'',
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
            this.getExhibitType();
            this.getDataList();
            this.getFocus();
        },
        methods: {
            //自动获取焦点
            getFocus(){
                this.$refs.stockNumRef.focus();
            },
            getFocus2(){
                this.$refs.exhibitNumRef.focus();
            },
            //货架号扫码枪扫描后处理
            stockNumChange(data){
                this.stockNum = data;
                this.getFocus2();
            },
            //卷宗号扫码枪扫描后处理
            exhibitNumChange(data){
                this.exhibitNum = data;
                // 默认数据列表
                this.getIds();
                

            },
            async getIds(){
                    // console.log({...this.seatchData})
                    let dataInfo = {}
                    dataInfo ['exhibit_type'] = this.exhibit_type;
                    dataInfo ['code'] = this.exhibitNum;
                    
                    const resultData = await this.$api.getIds(dataInfo);
                    if(resultData && resultData.code == '0') {
                        console.log(resultData)
                        console.log(resultData.data)
                        console.log(resultData.data.type)
                        if(resultData.data.type=="exhibit"){
                            this.exhibit_id = resultData.data.exhibit.exhibit_id;
                            // self.Warehousing()
                            this.exhibitIn();
                        }else if(resultData.data.type=="cell"){
                            
                        }
                        // this.getDataList();
                        // this.$message({
                        //     message: '入库成功',
                        //     type: 'success'
                        // });
                        // this.exhibitNum = "";
                        // this.getFocus('exhibitNumRef');
                    }
            },
            async exhibitIn(){
                    // console.log({...this.seatchData})
                    let dataInfo = {}
                    dataInfo ['cell_id'] = this.stockNum;
                    dataInfo ['exhibit_id'] = this.exhibit_id;
                    
                    const resultData = await this.$api.exhibitIn(dataInfo);
                    if(resultData && resultData.code == '0') {
                        this.getDataList();
                        this.$message({
                            message: '入库成功',
                            type: 'success'
                        });
                        this.exhibitNum = "";
                        this.getFocus('exhibitNumRef');
                    }
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 分类&&角标
            getCaseType(seatchData){
                this.$api.getCaseType().then(async (res)=>{
                    this.tabItems = res.data.list;
                    this.activeName = res.data.list[0].case_type_id;
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
                let dataInfo = {}
                dataInfo ['pageNum'] = this.currentPage1;
                dataInfo ['pageSize'] = this.pageSize;
                dataInfo ['is_back'] = '0';
                // dataInfo ['case_type_id'] = this.activeName;
                
                const resultData = await this.$api.getBorrowList(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data.list,
                    this.total1 = resultData.data.total
                }
            },
            //查询卷宗类别如：诉讼 文书 技术
            async getExhibitType(){
                // console.log({...this.seatchData})
                // let dataInfo = { ...this.seatchData }
                // dataInfo ['pageNum'] = this.currentPage1;
                // dataInfo ['pageSize'] = this.pageSize;
                // dataInfo ['case_type_id'] = this.activeName;
                
                const resultData = await this.$api.getExhibitType();
                if(resultData && resultData.code == '0') {
                    this.exhibitType = resultData.data
                    // console.log(this.exhibitType)
                    // this.total1 = resultData.data.total
                }
            },

            comfirmSearch(data){
                console.log(data)
                this.$nextTick(()=>{ for(let key in data) { this.seatchData[key] = data[key] } })
                this.getCaseType(this.seatchData);
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                console.log(tab, event);
                this.getDataList(this.seatchData);
            },
            
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList(this.seatchData);
            },
            // 导出
            openExportExcelFun(data){
                // console.log(data)
                this.$nextTick(()=>{
                    console.log(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
                    // window.open(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        // '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        // '&city_id='+data.city_id+ '&area_id='+data.area_id)
                })
            },
            // 小弹窗
            examineClick(res){ 
                console.log(res)
                this.disabled1 = true;
                this.dialogVisible = true;
                this.progressList = res;
                setTimeout(()=>{
                    this.disabled1 = false;
                },2000)

            },
            
        },
    }
</script>
<style lang="scss">
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .inWarehousePage{
        // margin: 20px;
        .scan-table{
            // margin-top: -0px;
            width: 100%;
            height: 60px;
            line-height: 60px;
            border:1px solid #6db4ff;
            background-color: #eaf5ff;
            display: flex;
            .scan-select{
                display: flex;
                align-items: center;
                margin-top: 2px;
            }
            .scan-input{
                width: 250px;
                margin-left: 20px;
            }
            .head-text{
                margin-left: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 14px;
            }
        }
        .searchInfo{
            margin-top: 10px;
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
            margin-top: 10px;
            
            .table-dataList{
                // margin-top: 10px;
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
