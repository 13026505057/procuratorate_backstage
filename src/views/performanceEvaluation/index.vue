<template>
    <div class="progress-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table
                    v-loading="isLoading"
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
                        <template slot-scope="{row}">
                            <span v-if="tableItem.tableId == 2">{{Number(row.none_count)+Number(row.in_count)}}</span>
                            <!-- <span v-if="tableItem.tableId == 22">{{Number(row.all_count)-Number(row.in_count)}}</span> -->
                            <span v-else>{{row[tableItem.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currentPage1"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total1">
                </el-pagination>
            </div> -->
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { setTimeout } from 'timers';
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed:{
            ...mapGetters(['org_id','base_url'])
        },
        data()  {
            return  {
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'timeYear', value: '',placeholder: '请选择年份', itemId: 6, name: 'dataPicker' },
                ],
                selectOption:{},
                setDynamicBtn: [
                    { title: '导出', fun: 'exprotFun' }
                ],
                activeName: "0",
                tabItems:[],
                tableData:[],
                badgeList:[],
                tableItems:[
                    {label: "单位名称", prop: "org_name", tableId:1},
                    {label: "应交卷数量", prop: "", tableId:2},
                    {label: "实交卷数量", prop: "in_count", tableId:3},
                    {label: "超期未交卷数量", prop: "chaoqi_count", tableId:4},
                    {label: "交卷率", prop: "persent", tableId:5},

                ],
                tableItemsCity:[
                    {label: "单位名称", prop: "org_name", tableId:1},
                    {label: "应交卷数量", prop: "", tableId:2},
                    {label: "实交卷数量", prop: "in_count", tableId:3},
                    {label: "超期未交卷数量", prop: "chaoqi_count", tableId:4},
                    {label: "交卷率", prop: "persent", tableId:5},
                ],
                tableItemsArea:[
                    {label: "办案人姓名", prop: "case_take_user_name", tableId:1},
                    {label: "单位名称", prop: "org_name", tableId:3},
                    {label: "部门名称", prop: "dept_name", tableId:4},
                    {label: "应交卷数量", prop: "", tableId:2},
                    {label: "实交卷数量", prop: "in_count", tableId:6},
                    {label: "未交卷数量", prop: "chaoqi_count", tableId:22},
                    {label: "交卷率", prop: "persent", tableId:7},
                ],
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
                seatchData: {
                    timeYear:'',
                    case_name:'',
                    case_bh:'', //统一受案号
                    case_take_user_name:'',
                },
                isLoading:false,
            }
        },
        mounted(){
            // this.getCaseType(this.seatchData);
            this.getDataList()
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 分类&&角标
            getCaseType(seatchData){
                this.$api.getCaseType().then(async (res)=>{
                    this.tabItems = res.data.list;
                    if(this.activeName == '0') this.activeName = res.data.list[0].case_type_id;
                    this.getDataList();
                    const resultData = await this.$api.getCornerMarkType(seatchData);
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
                this.isLoading = true;
                if(this.seatchData.area_id&&this.seatchData.area_id!=''){
                    //查询基层院的归档率
                    this.tableItems = this.tableItemsArea;
                    let dataInfo = { ...this.seatchData }
                    // dataInfo ['area_id'] = this.org_id;
                    dataInfo ['nd'] = this.seatchData.timeYear;
                    dataInfo ['city_id'] = '';
                    const resultData = await this.$api.caseJauge(dataInfo);
                    if(resultData && resultData.code == '0') {
                        this.tableData = resultData.data;
                        this.isLoading = false
                    }
                }else{
                    //查询地级市的归档率
                    let dataInfo = { ...this.seatchData }
                    dataInfo ['nd'] = this.seatchData.timeYear;
                    dataInfo ['area_id'] = '';
                    this.tableItems = this.tableItemsCity;
                    const resultData = await this.$api.caseJaugeAll(dataInfo);
                    if(resultData && resultData.code == '0') {
                        this.tableData = resultData.data;
                        this.isLoading = false
                    }
                }
            },
            comfirmSearch(data){
                // console.log(data)
                this.$nextTick(()=>{ 
                    for(let key in data) { this.seatchData[key] = data[key] } 
                    this.getDataList();
                })
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFun": "openExportExcelFun"
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            // 导出
            openExportExcelFun(data){
                this.$nextTick(()=>{ 
                    console.log(this.base_url+'/?nd='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+
                        '&province_id='+data.province_id+'&city_id='+data.city_id+'&area_id='+data.area_id);
                    // window.open(this.base_url+'/?nd='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+
                        // '&province_id='+data.province_id+'&city_id='+data.city_id+'&area_id='+data.area_id)
                })
            },
            
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                console.log(tab, event);
                this.getDataList();
            },
            
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            
            
        },
    }
</script>
<style lang="scss">
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
