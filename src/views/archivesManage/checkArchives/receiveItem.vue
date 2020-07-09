<template>
    <div class="receiveItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"
            :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab" @tab-click="handleClickTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 4">{{ row[item.title] | mapStatus }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="250">
                                <template slot-scope="{row}">
                                    <el-button @click="showDialogPanel(row.exhibits)" class="highlight-btn" size="small">已有案卷</el-button>
                                    <el-button @click="receivedItem(row.case_id,row.case_bh)" class="highlight-btn" size="small">接收案卷</el-button>
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
                            :total="pagination.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 案卷详情 -->
        <el-dialog v-dialogDrag title="案卷详情" :visible.sync="showModel.dialogTableVisible" width="70%">
            <el-table :data="showModel.gridData" align="center">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 6" :style="{'color':row[item.title]=='in'?'':'red'}">{{ row[item.title]=='in'?'已入库':'待入库' }}</span>
                        <span v-else-if="item.itemId == 7" :style="{'color':row[item.title]=='0'?'red':''}">{{ row[item.title]=='0'?'失效':'有效' }}</span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="350">
                    <template slot-scope="{row}">
                        <!-- <el-button @click="editExhibitData(row)" class="highlight-btn" type="operation" size="small">编辑</el-button> -->
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">补打条码</el-button>
                        <el-button @click="printReceipt(row.exhibit_id)" class="highlight-btn" type="operation" size="small">打印回执单</el-button>
                        <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <DialogPagin ref="dialogTablePagin" :tableData="showModel.gridData_temporary" @dialogTablePagin="dialogTablePagin"/>
        </el-dialog>
        <!-- 接收案卷 -->
        <el-dialog v-dialogDrag :title="showModel.dialogReceivedTitle" :visible.sync="showModel.dialogReceivedVisible">
            <el-form  :model="submitDataInfo" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                
                <el-form-item label="档号" prop="dh">
                    <el-input class="input_class" v-model="submitDataInfo.dh"></el-input>
                </el-form-item>
                <el-form-item label="卷号" prop="jh">
                    <el-input class="input_class" v-model="submitDataInfo.jh"></el-input>
                </el-form-item>
                <el-form-item label="被告人/嫌疑人" prop="bgr">
                    <el-input class="input_class" v-model="submitDataInfo.bgr"></el-input>
                </el-form-item>
                <el-form-item label="年度" prop="nd">
                    <el-input class="input_class" v-model="submitDataInfo.nd"></el-input>
                </el-form-item>
                
                <el-form-item label="保管期限" prop="bgqx">
                    <el-select class="input_class" v-model="submitDataInfo.bgqx" >
                        <el-option v-for="itemChild in showModel.selectOption_time" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="案卷类型" prop="exhibit_type">
                    <el-select class="input_class" v-model="submitDataInfo.exhibit_type">
                        <el-option v-for="itemChild in showModel.selectOption_type" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <div v-for="(item,index) in eachDataInfoList" :key="index" style="display:table;width: 100%;margin-bottom: 10px">
                    <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                        {{ item.captionTitle }}：
                    </span>
                    <el-input v-model="submitDataInfo[item.dom]" v-if="item.itemId<4 || item.itemId == 5"
                        :placeholder="item.placeholder" style="width: auto"></el-input>
                    <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.itemId == 4">
                        <el-option v-for="itemChild in showModel.selectOption_type" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                    <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.itemId == 6">
                        <el-option v-for="itemChild in showModel.selectOption_time" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </div> -->
                <div class="checkboxSelect">
                    <el-checkbox v-model="submitDataInfo.print_code">同时打印案件条形码</el-checkbox>
                    <el-checkbox v-model="submitDataInfo.print_accept">同时打印收卷回执单</el-checkbox>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogReceivedVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 批量打印回执单 -->
        <el-dialog v-dialogDrag title="批量打印回执单" :visible.sync="showModel.dialogPrintVisible" @close="resetPrintPagination" width="90%">
            <el-table ref="multipleTable" :data="showModel.print_tableData" align="center" v-loading="loadingTable_print" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in showModel.print_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 6" :style="{'color':row[item.title]=='in'?'':'red'}">{{ row[item.title]=='in'?'已入库':'待入库' }}</span>
                        <span v-else-if="item.itemId == 7" :style="{'color':row[item.title]=='0'?'red':''}">{{ row[item.title]=='0'?'失效':'有效' }}</span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="{row}">
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">补打条码</el-button>
                        <el-button @click="printReceipt(row.exhibit_id)" class="highlight-btn" type="operation" size="small">打印回执单</el-button>
                        <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
                <el-button @click="toggleSelection(showModel.print_tableData)">全选</el-button>
                <el-button @click="toggleSelection()">取消全选</el-button>
                <el-button @click="printSelectAll">批量打印回执单</el-button>
            </div>
            <!-- 分页 -->
            <el-pagination small background
                style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                @current-change="openPrintReceiptFun" :current-page.sync="showModel.pagination.pageNum"
                :page-size="showModel.pagination.pageSize" layout="prev, pager, next, jumper"
                :total="showModel.pagination.total">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import DialogPagin from '@/components/DialogPagin'
    import { mapGetters,mapActions } from 'vuex'
    export default {
        components: { Search,DialogPagin },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','temporary_nd','print_id'])
        },
        filters: {
            mapStatus(status){
                const statusMap = {
                    "in": "已归档",
                    "in_jj_out": "已归档（交卷超期）",
                    "in_rk_out": "已归档（入库超期）",
                    "in_all_out": "已归档（双超期）",
                    "none": "未归档",
                    "none_jj_out": "未归档（交卷超期）",
                    "none_rk_out": "未归档（入库超期）",
                    "none_all_out": "未归档（双超期）",
                }
                return statusMap[status]
            }
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_name: '',
                    case_bh: '',
                    timeYear: '',
                    case_take_user_name: '',
                    case_type_id: '',
                },
                loadingTable: false,
                loadingTable_print: false,
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                selectOption: {},
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                    // 案卷详情
                    dialogTableVisible: false,
                    submiteModel: false,
                    gridData: [],
                    gridData_temporary: [],
                    gridData_columns: [
                        { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 1 },
                        { title: 'case_name', dataIndex: '卷宗名称', itemId: 2 },
                        { title: 'dh', dataIndex: '档号', itemId: 3 },
                        { title: 'jh', dataIndex: '卷号', itemId: 4 },
                        { title: 'bgr', dataIndex: '被告人/嫌疑人', itemId: 5 },
                        { title: 'stock_status', dataIndex: '案卷状态', itemId: 6 },
                        { title: 'exhibit_status', dataIndex: '是否有效', itemId: 7 },
                        { title: 'cell_name', dataIndex: '存储位置', itemId: 8 },
                    ],
                    // 新增案卷
                    dialogReceivedVisible: false,
                    dialogReceivedTitle: '',
                    selectOption_type: [],
                    selectOption_time: [],
                    // 批量打印回执单
                    dialogPrintVisible: false,
                    pagination: {
                        pageNum: 1,
                        pageSize: 10,
                    },
                    print_tableData: [],
                    print_columns: [
                        { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 1 },
                        { title: 'dh', dataIndex: '档号', itemId: 3 },
                        { title: 'jh', dataIndex: '卷号', itemId: 4 },
                        { title: 'case_name', dataIndex: '卷宗名称', itemId: 5 },
                        { title: 'stock_status', dataIndex: '案卷状态', itemId: 6 },
                        { title: 'exhibit_status', dataIndex: '是否有效', itemId: 7 },
                        { title: 'cell_name', dataIndex: '存储位置', itemId: 8 },
                    ],
                    print_exhibit_ids: ''
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', overflow: false, itemId: 8 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 2 },
                    { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                    { title: 'time_status', dataIndex: '是否归档', itemId: 4 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    { title: 'total_quantity', dataIndex: '总案卷数', itemId: 5 },
                    { title: 'in_quantity', dataIndex: '在库案卷数', itemId: 6 },
                    { title: 'wait_quantity', dataIndex: '待入库案卷数', itemId: 7 },
                ],
                submitDataInfo: {
                    case_id: '',
                    nd: '',
                    exhibit_type: '',
                    bgqx: '',
                    dh: '',
                    jh: '',
                    bgr: '',
                    print_code: 1,
                    print_accept: 0
                },
                rules: {
                    nd: [
                        { required: true, message: '请输入年度', trigger: 'blur' },
                        { min: 4, max: 4, message: '年份输入错误', trigger: 'blur' },
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    dh: [
                        // { required: true, message: '请输入档号', trigger: 'blur' },
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    jh: [
                        { required: true, message: '请输入卷号', trigger: 'blur' },
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    bgr: [
                         { required: true, message: '请输入被告人', trigger: 'blur' },
                    ],
                    // case_type_id:[
                    //     { required: true, message: '请选择案件类型', trigger: 'blur' },
                    // ],
                    // exhibit_name:[
                    //     { required: true, message: '请输入a', trigger: 'blur' },
                    // ]
                },
                submitDataInfo_temporary: {},
                eachDataInfoList: [
                    { captionTitle: '档号', placeholder: '请输入档号', dom: 'dh', itemId: 1 },
                    { captionTitle: '卷号(必填)', placeholder: '请输入卷号', dom: 'jh', itemId: 2 },
                    { captionTitle: '被告人/嫌疑人(必填)', placeholder: '请输入被告人/嫌疑人', dom: 'bgr', itemId: 3 },
                    { captionTitle: '卷宗类型(必填)', placeholder: '', dom: 'exhibit_type', itemId: 4 },
                    { captionTitle: '选择年度(必填)', placeholder: '请输入年度 如 2018', dom: 'nd', itemId: 5 },
                    { captionTitle: '选择期限(必填)', placeholder: '', dom: 'bgqx', itemId: 6 },
                ],
                setDynamicBtn: [
                    { title: '批量打印回执单', fun: 'exprotFunAll' }
                ],
            }
        },
        mounted(){
            this.getCaseType();
            this.getTypeList();
        },
        methods: {
            ...mapActions({ "setTemporaryNd": "settings/setTemporaryNd" }),
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFunAll": "openPrintReceiptFun"
                }
                this[statusMap[data.fun]]()
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            // DialogPagin
            dialogTablePagin(data){
                this.showModel.gridData = data
            },
            toggleSelection(rows) {
                if (rows) rows.forEach(row => this.$refs.multipleTable.toggleAllSelection() )
                    else this.$refs.multipleTable.clearSelection()
            },
            resetPrintPagination(){
                this.showModel.pagination.pageNum = 1;
                this.showModel.pagination.pageSize = 10;
            },
            openPrintReceiptFun(){
                this.showModel.dialogPrintVisible = true;
                this.printReceiptFun(this.showModel.pagination)
            },
            async printReceiptFun(dataInfo){
                this.loadingTable_print = true;
                let resultData = await this.$api.getTodayByPage(dataInfo)
                if(resultData && resultData.code == '0'){
                    const pagination = { ...this.showModel.pagination };
                    this.showModel.print_tableData = resultData.data.list;
                    pagination.total = resultData.data.total;
                    this.showModel.pagination = pagination;
                }
                this.loadingTable_print = false;
            },
            handleClickTab(e){
                this.pagination.case_type_id = e.paneName
                this.getTableList(this.pagination)
            },
            // 选中
            handleSelectionChange(val){
                this.showModel.print_exhibit_ids = val
            },
            // 查询犯罪嫌疑人
            async getCasesBgrName(dataInfo){

                const sendData = {};
                sendData ['tysah'] = dataInfo;
                sendData ['pageNum'] = '1';
                sendData ['pageSize'] = '100';
                this.submitDataInfo.bgr = '';
                let resultData = await this.$api.getCasesBgrName(sendData)
                if(resultData && resultData.code == '0'){
                    if(resultData.data.list.map.length>0){
                        let bgrName = '';
                        resultData.data.list.map( item=> bgrName=bgrName+item.xm+',' )
                        this.submitDataInfo.bgr = bgrName;
                    }
                     
                }
            },
            async printSelectAll(){
                let print_ids = [];
                this.showModel.print_exhibit_ids.map( item=> print_ids.push(item.exhibit_id) )
                let resultData = await this.$api.printTodayExhibits({exhibit_ids: print_ids.join() })
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'selectOption_time', store: 'exhibit_time_bg' },
                    { showModel: 'selectOption_type', store: 'exhibit_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            // 类型分类
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.showModel.tableList = res.data.list;
                    if(this.showModel.activeNameTab !== '0') this.pagination.case_type_id = this.showModel.activeNameTab
                        else this.pagination.case_type_id = this.showModel.activeNameTab = res.data.list[0].case_type_id
                    // 角标
                    let dataInfo = {...this.pagination};
                    // 每个页面字段不同(cout_for)
                    dataInfo['case_none_confirm'] = '1';
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
                    this.getTableList(this.pagination)
                })
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getConfirmedByPage(dataInfo);
                const pagination = { ...this.pagination };
                let resultData_table = [];
                resultData.data.list.map(item=>{
                    resultData_table.push({...item,wait_quantity: item.total_quantity - item.in_quantity})
                })
                this.showModel.tableData = resultData_table;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] } })
                this.getCaseType()
            },
            showDialogPanel(dataInfo){
                this.showModel.dialogTableVisible = true;
                this.showModel.gridData_temporary = dataInfo
                this.$nextTick(() => {
                    this.$refs.dialogTablePagin.dialogTablePagin(1)
                })
            },
            // 补打条形码
            async printQrCodeAgain(exhibit_id){
                const sendData = {};
                sendData ['exhibit_id'] = exhibit_id;
                sendData ['print_id'] = this.print_id;
                let resultData = await this.$api.printAgain(sendData)
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 打印回执单
            async printReceipt(exhibit_id){
                const sendData = {};
                sendData ['exhibit_id'] = exhibit_id;
                sendData ['print_id'] = this.print_id;
                let resultData = await this.$api.printAcceptReturn(sendData)
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 作废
            async deleteCancel(exhibit_id){
                let resultData = await this.$api.editCaseData({exhibit_id,exhibit_status: 0})
                if(resultData && resultData.code == '0') {
                    this.$message.success('操作成功')
                    this.getCaseType()
                }
            },
            // 接收案卷信息
            receivedItem(case_id,case_bh){
                this.showModel.dialogReceivedVisible = true;
                this.showModel.submiteModel = false;
                this.showModel.dialogReceivedTitle = '接收案件'
                this.resetSubmitInfo();
                this.submitDataInfo.case_id = case_id;
                this.getCasesBgrName(case_bh)
            },
            //重置表单
            resetSubmitInfo(){
                for( let key in this.submitDataInfo){ this.submitDataInfo[key] = '' }
                this.submitDataInfo.print_code = true;
                this.submitDataInfo.nd = this.temporary_nd || new Date().getFullYear();
                this.submitDataInfo.exhibit_type = localStorage.getItem('exhibit_type');
                this.submitDataInfo.bgqx = localStorage.getItem('bgqx');
            },
            // 确认提交
            async confirmBtn(){
                if(this.showModel.submiteModel) this.confirmEditExhibit();
                    else this.addExhibitData()
            },
            // 确认新增
            async addExhibitData(){
                ['print_code','print_accept'].map(item=> this.submitDataInfo[item] = Number(this.submitDataInfo[item])) || 0
                this.submitDataInfo ['print_id']  = this.print_id;
                let resultData = await this.$api.addExhibitData(this.submitDataInfo)
                if(resultData && resultData.code=='0'){
                    this.setTemporaryNd(this.submitDataInfo.nd)
                    this.$message.success('添加成功')
                    localStorage.setItem('bgqx',this.submitDataInfo.bgqx)
                    localStorage.setItem('exhibit_type',this.submitDataInfo.exhibit_type)
                    this.getCaseType()
                    this.resetSubmitInfo()
                }
            },
            // 确认修改
            async confirmEditExhibit(){
                console.log(this.submitDataInfo_temporary,this.submitDataInfo);
                ['print_code','print_accept'].map(item=> this.submitDataInfo[item] = Number(this.submitDataInfo[item])) || 0;
                const checkEdit = () => { 
                    let edit = false;
                    console.log(this.submitDataInfo_temporary,this.submitDataInfo)
                    Object.keys(this.submitDataInfo_temporary).map(item=>{
                        if(this.submitDataInfo[item] !== this.submitDataInfo_temporary[item]) edit = true
                    })
                    return edit
                }
                if(checkEdit()) {
                    this.submitDataInfo.print_code = 1;
                    let resultData = await this.$api.editCaseData(this.submitDataInfo);
                    if(resultData && resultData.code=='0') {
                        this.$message.success('修改成功');
                        this.showModel.dialogReceivedVisible = false;
                    } 
                }
                
            },
            // 编辑案卷
            async editExhibitData(data){
                this.showModel.submiteModel = true;
                this.showModel.dialogReceivedTitle = '编辑案件信息'
                this.showModel.dialogReceivedVisible = true
                Object.keys(this.submitDataInfo).map(item=> this.submitDataInfo[item] = data[item] )
                this.submitDataInfo['dh'] = data['dh'].split('-')[3]
                this.submitDataInfo['exhibit_id'] = data['exhibit_id']
                this.submitDataInfo['print_code'] = true;
                this.submitDataInfo['print_id'] = this.print_id;
                this.submitDataInfo_temporary = { ...this.submitDataInfo }
            },
        },
    }
</script>
<style lang="scss">
    .receiveItemPage{
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
        .demo-ruleForm{
            width: 60%;
            margin:0 auto;
            // text-align: center;
            .input_class{
                width:250px;
                margin:0 auto;
            }
        }
        .checkboxSelect{
            padding: 15px 0 0 10%;;
        }
    }
</style>
