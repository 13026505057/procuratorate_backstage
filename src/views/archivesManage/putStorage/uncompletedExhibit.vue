<template>
    <div class="uncompletedPutPage">
        <Search style="margin-top:10px;" :addSearch="addSearch" :selectOption="selectOption" :resetData="true" :type="'exhibit'" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab"  v-loading="tableLoading">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table :data="showModel.tableData" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 12">{{ row[item.title] | mapStatus }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <!-- 分页 -->
                        <el-pagination small background
                            style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                            @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum"
                            :page-size="pagination.pageSize" layout="prev, pager, next, jumper"
                            :total="showModel.tableList[0].contNum">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import DialogPagin from '@/components/DialogPagin'
    import { exportExcelFun } from '@/utils/auth'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search,DialogPagin },
        computed :{
            ...mapGetters(['exhibit_time_bg','base_url'])
        },
        filters:{
            mapStatus(status){
                const statusList = {
                    SS:"诉讼",
                    JS:"技术",
                    WS:"文书",
                }
                return statusList[status]
            }
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    stock_log_type: 'init',
                },
                tableLoading:false,
                exhibit_type:'SS',
                stockNum:'',
                exhibitNum:'',
                exhibitType:[],
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 1, name: 'input' },
                    { dom: 'bmsah', value: '',placeholder: '请输入部门受案号', itemId: 2, name: 'input' },
                    { dom: 'case_name', value: '',placeholder: '请输入案件名称', itemId: 3, name: 'input' },
                    // { dom: 'exhibit_name', value: '',placeholder: '请输入案卷名称', itemId: 4, name: 'input' },
                    { dom: 'bgr', value: '',placeholder: '请输入嫌疑人', itemId: 5, name: 'input' },
                    { dom: 'cbr', value: '',placeholder: '请输入承办人', itemId: 6, name: 'input' },
                    { dom: 'nd', value: '',placeholder: '年度', itemId: 7, name: 'dataPicker' },
                ],
                setDynamicBtn: [
                    { title: '导出', fun: 'exprotFun' }
                ],
                selectOption: {},
                showModel: {
                    activeNameTab: "uncompletedExhibit",
                    tableList:[{
                        case_type_id:'uncompletedExhibit',
                        case_type_name:'待入库上架案卷',
                        contNum: 0
                    }],   // 类型
                    tableData:[],   // 数据信息
                    // 案卷详情
                    dialogTableVisible: false,
                    gridData: [],
                    gridData_temporary: [],
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 2 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 3 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 4 },
                    // { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 10 },
                    { title: 'cbr', dataIndex: '承办人', itemId: 5 },
                    { title: 'bgr', dataIndex: '嫌疑人', itemId: 6 },
                    { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 12 },
                    { title: 'dh', dataIndex: '档号', overflow: false, itemId: 7 },
                    { title: 'jh', dataIndex: '卷号', overflow: true, itemId: 13 },
                    { title: 'nd', dataIndex: '年度', overflow: true, itemId: 9 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', overflow: false, itemId: 8 },
                    { title: 'exhibit_create_time', dataIndex: '接收时间', itemId: 11 },
                ],
            }
           
        },
        mounted(){
            // this.getCaseType();
            // this.getFocus();
            // this.getExhibitType();
            this.getExhibitUncomplete(this.pagination);
        },
        methods: {
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
            //查询已入库卷宗记录
            async getExhibitUncomplete(data){
                // console.log({...this.seatchData})
                let dataInfo = data;
                this.tableLoading = true;
                dataInfo ['stock_status'] = 'none';
                const resultData = await this.$api.getExhibit(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.showModel.tableData = resultData.data.list;
                    this.showModel.tableList[0].contNum = Number(resultData.data.total);
                    this.tableLoading = false;
                    // console.log(this.exhibitType)
                    // this.total1 = resultData.data.total
                }
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
                    window.open(this.base_url+'/exhibit/exhibit/exoprtExhibits?'+exportExcelFun(data))
                })
            },
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
                        this.$message({
                            message: '入库成功',
                            type: 'success'
                        });
                        this.getExhibitUncomplete(this.pagination);
                        this.exhibitNum = "";
                        this.getFocus('exhibitNumRef');
                    }
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getExhibitUncomplete(this.pagination)
            },
            // DialogPagin
            dialogTablePagin(data){
                this.showModel.gridData = data
            },
            // handleClickTab(e){
            //     this.pagination.case_type_id = e.paneName
            //     this.getTableList(this.pagination)
            // },
            // 类型分类
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.showModel.tableList = res.data.list;
                    if(this.showModel.activeNameTab !== '0') this.pagination.case_type_id = this.showModel.activeNameTab
                        else this.pagination.case_type_id = this.showModel.activeNameTab = res.data.list[0].case_type_id
                    this.getTableList(this.pagination)
                    // 角标
                    let dataInfo = {...this.pagination};
                    // 每个页面字段不同(cout_for)
                    dataInfo.cout_for = 'dangAnJianChaTongGuo';

                    ['pageNum','pageSize','case_type_id'].map(item=> delete dataInfo[item])
                    const resultData = await this.$api.getCornerMarkType(dataInfo);
                    Object.keys(resultData.data).map(item=>{
                        res.data.list.map((itemChild,index)=>{
                            if("_"+itemChild.case_type_id == item) {
                                itemChild.contNum = resultData.data[item]
                                this.$set(this.showModel.tableList[index],index,itemChild)
                            }
                        })
                    })
                })
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.tableLoading = true;
                this.showModel.dialogTableVisible = false;
                const resultData = await this.$api.getDangAnConfirmByPage(dataInfo);
                const pagination = { ...this.pagination };
                let resultData_table = [];
                resultData.data.list.map(item=>{
                    resultData_table.push({...item,wait_quantity: item.total_quantity - item.in_quantity})
                })
                this.showModel.tableData = resultData_table;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.tableLoading = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getExhibitUncomplete(this.pagination)
            },
        },
    }
</script>
<style lang="scss">
    .uncompletedPutPage{
        margin: 20px;
        .scan-table{
            margin-top: -20px;
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
                margin-top: 40px;
                display: flex;
                justify-content: center;
                .page-change{
                    height: 28px;
                    line-height: 28px;
                    font-size: 13px;
                    margin: 2px 5px;
                    padding: 0px 6px;
                    // background-image: $gradual-color;
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
        }
    }
    
</style>
