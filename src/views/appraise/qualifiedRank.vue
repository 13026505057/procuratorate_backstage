<template>
    <div class="progress-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table v-loading="isLoading" :data="tableData" :header-cell-style="headerRowStyle"
                    border style="width: 100%" @cell-click="showUserDetail">
                    <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
                    <el-table-column align="center" v-for="tableItem in tableItems" :prop="tableItem.prop"
                        :label="tableItem.label" :key="tableItem.label">
                        <template slot-scope="{row}">
                            <span v-if="tableItem.tableId == 2">{{Number(row.none_count)+Number(row.in_count)}}</span>
                            <span v-else>{{row[tableItem.prop]}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed:{
            ...mapGetters(['org_id','base_url','org_list'])
        },
        data()  {
            return  {
                addSearch: [
                    { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                    { dom: 'begin_time', value: '',placeholder: '开始时间', itemId: 5, name: 'daterange_begin' },
                    { dom: 'end_time', value: '',placeholder: '结束时间', itemId: 6, name: 'daterange_end' },
                    { dom: 'status_case', value: [],placeholder: '请选择查询状态', itemId: 7, name: 'cascader' },
                    { dom: 'weila_status', value: 'la_dao',placeholder: '是否包含不规范办结', itemId: 8, name: 'select' },
                   
                ],
                selectOption:{ 
                    status_case: [],
                    weila_status:[
                        { value:'la_dao', label:"不包含不规范办结",},
                        { value:'', label:"包含不规范办结",},
                    ]
                },
                showModel: {
                    status_case_city: [
                        {   value: 'sl', label: '按受理年度',
                            children: [
                                { value: 'all', label: '全市' },
                                { value: 'area', label: '区院' },
                            ]
                        },
                        {   value: 'bj', label: '按办结年度',
                            children: [
                                { value: 'all', label: '全市' },
                                { value: 'area', label: '区院' },
                            ]
                        },
                    ],
                    status_case_area: [
                        {  value: 'sl', label: '按受理年度' },
                        {  value: 'bj', label: '按办结年度' },
                    ],
                },
                tableData:[],
                tableItems:[],
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
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    weila_status:'la_dao',
                },
                isLoading:false,
            }
        },
        mounted(){
            this.initLevelData()
            this.getDataList(this.seatchData)
        },
        methods: {
            initLevelData(){
                if(this.org_list && this.org_list[0].level !== 'area') {
                    this.selectOption.status_case = this.showModel.status_case_city
                    let dataArr = ['sl','all']
                    this.addSearch.map(item => {if(item.dom == 'status_case') item.value = dataArr })
                    this.seatchData.status_case = JSON.stringify(dataArr)
                } else {
                    this.selectOption.status_case = this.showModel.status_case_area
                    let dataArr = ['sl']
                    this.addSearch.map(item => {if(item.dom == 'status_case') item.value = dataArr })
                    this.seatchData.status_case = JSON.stringify(dataArr)
                }
            },
            // 展示个人统计数
            showUserDetail(row, column, cell, event){
                console.log(row, column, cell, event)
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 默认数据列表
            async getDataList(dataInfo){
                // 受理和办结
                let status = dataInfo.status_case
                console.log(status)
                let dataList = [
                    { dom: ["sl","all"], fun: "caseJaugeAllSlrq" },
                    { dom: ["sl","area"], fun: "caseJaugeSlrq" },
                    { dom: ["bj","all"], fun: "caseJaugeAll" },
                    { dom: ["bj","area"], fun: "caseJauge" },
                    { dom: ["sl"], fun: "caseJaugeSlrq" },
                    { dom: ["bj"], fun: "caseJauge" },
                ]
                dataList.map(item=>{
                    if(status == JSON.stringify(item.dom)) {
                        delete dataInfo.status_case;
                        this[item.fun](dataInfo)
                    }
                })
            },
            //查询地级市的归档率 - 受理
            async caseJaugeAllSlrq(dataInfo){
                this.isLoading = true;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['area_id'] = '';
                this.tableItems = this.tableItemsCity;
                const resultData = await this.$api.caseJaugeAllSlrq(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            //查询基层院的归档率 - 受理
            async caseJaugeSlrq(dataInfo){
                this.isLoading = true;
                this.tableItems = this.tableItemsArea;
                // dataInfo ['area_id'] = this.org_id;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['city_id'] = '';
                const resultData = await this.$api.caseJaugeSlrq(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            //查询地级市的归档率 - 办结
            async caseJaugeAll(dataInfo){
                this.isLoading = true;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['area_id'] = '';
                this.tableItems = this.tableItemsCity;
                const resultData = await this.$api.caseJaugeAll(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            //查询基层院的归档率 - 办结
            async caseJauge(dataInfo){
                this.isLoading = true;
                this.tableItems = this.tableItemsArea;
                // dataInfo ['area_id'] = this.org_id;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['city_id'] = '';
                const resultData = await this.$api.caseJauge(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            comfirmSearch(data){
                console.log(data)
                this.$nextTick(()=>{ 
                    for(let key in data) { this.seatchData[key] = data[key] } 
                    this.getDataList(this.seatchData)
                })
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
        },
    }
</script>
<style lang="scss">
    .progress-content{
        margin: 20px;
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
