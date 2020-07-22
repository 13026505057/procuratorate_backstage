<template>
    <div class="historicalCasesPage">
        <!-- <DynamicSearch  @comfirmSearch="comfirmSearch"/> -->
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'case'" @comfirmSearch="comfirmSearch"
            :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun" @exportExcelFun="openExportExcelFun" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                        v-for="item in columns" :key="item.itemId" align="center">
                        <template slot-scope="{row}">
                            <span v-if="item.itemId == 4">{{ row[item.title] | mapStatus }}</span>
                            <span v-else-if="item.itemId == 8">{{ row[item.title]=='1'?'评查中':'待入库' }}</span>
                            <span v-else>{{ row[item.title] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="250">
                        <template slot-scope="{row}">
                            <el-button @click="showDialogPanel(row.exhibits)" class="highlight-btn" size="small">已有案卷</el-button>
                            <el-button @click="receivedItem(row.case_id)" class="highlight-btn" size="small">新增案卷</el-button>
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
        </div>
        <!-- 案卷详情 -->
        <el-dialog v-dialogDrag title="案卷详情" :visible.sync="showModel.dialogTableVisible" width="60%">
            <el-table :data="showModel.gridData" align="center">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 6" :style="{'color':row[item.title]=='in'?'':'red'}">{{ row[item.title]=='in'?'已入库':'待入库' }}</span>
                        <span v-else-if="item.itemId == 7" :style="{'color':row[item.title]=='0'?'red':''}">{{ row[item.title]=='0'?'失效':'有效' }}</span>
                        <span v-else-if="item.itemId == 8">{{ row[item.title]=='1'?'评查中':'待入库' }}</span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="{row}">
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">补打条码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <DialogPagin ref="dialogTablePagin" :tableData="showModel.gridData_temporary" @dialogTablePagin="dialogTablePagin"/>
        </el-dialog>
        <!-- 接收案卷 -->
        <el-dialog v-dialogDrag title="接收案卷" :visible.sync="showModel.dialogReceivedVisible">
            <div v-for="(item,index) in eachDataInfoList" :key="index"
                style="display:table;width: 100%;margin-bottom: 10px">
                <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                    {{ item.captionTitle }}：
                </span>
                <el-input v-model="submitDataInfo[item.dom]" v-if="item.itemId<4 ||item.itemId == 5"
                    :placeholder="item.placeholder" style="width: auto"></el-input>
                <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.itemId == 4">
                    <el-option v-for="itemChild in showModel.selectOption_type" :key="itemChild.value" 
                        :label="itemChild.label" :value="itemChild.value"></el-option>
                </el-select>
                <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.itemId == 6">
                    <el-option v-for="itemChild in showModel.selectOption_time" :key="itemChild.value" 
                        :label="itemChild.label" :value="itemChild.value"></el-option>
                </el-select>
            </div>
            <div class="checkboxSelect">
                <el-checkbox v-model="submitDataInfo.print_code">同时打印案件条形码</el-checkbox>
                <el-checkbox v-model="submitDataInfo.print_accept">同时打印收卷回执单</el-checkbox>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogReceivedVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增案件 -->
        <el-dialog v-dialogDrag title="新增案件" :visible.sync="showModel.dialogAddCaseVisible" @close="resetSubmitInfo">
            <el-form :model="submitDataInfo_case" :rules="rules_addCase" ref="ruleForm" label-width="20%" class="demo-ruleForm">
                <template v-for="item in eachDataInfoList_case">
                    <el-form-item :label="item.captionTitle" :prop="item.dom">
                        <el-input v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-if="item.type == 'input'"></el-input>
                        <el-input v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" type="textarea" v-else-if="item.type == 'textarea'"></el-input>
                        <el-select v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="showModel.dialogAddCaseVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddCase('ruleForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
            ...mapGetters(['exhibit_type','exhibit_time_bg','case_type','base_url'])
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
                    pageSize: 10
                },
                loadingTable: false,
                addSearch: [],
                selectOption: {},
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                    // 案卷详情
                    dialogTableVisible: false,
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
                    selectOption_type: [],
                    selectOption_time: [],
                    // 新增案件
                    dialogAddCaseVisible: false,
                    exhibit_type: [],
                    bgqx: [],
                    case_type_id: []
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: -1 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 2 },
                    { title: 'case_none_status', dataIndex: '案件状态', itemId: 8 },
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
                    print_code: 0,
                    print_accept: 0
                },
                eachDataInfoList: [
                    { captionTitle: '档号', placeholder: '请输入档号', dom: 'dh', itemId: 1 },
                    { captionTitle: '卷号(必填)', placeholder: '请输入卷号', dom: 'jh', itemId: 2 },
                    { captionTitle: '被告人/嫌疑人(必填)', placeholder: '请输入被告人/嫌疑人', dom: 'bgr', itemId: 3 },
                    { captionTitle: '卷宗类型(必填)', placeholder: '', dom: 'exhibit_type', itemId: 4 },
                    { captionTitle: '选择年度(必填)', placeholder: '请输入年度 如 2018', dom: 'nd', itemId: 5 },
                    { captionTitle: '选择期限(必填)', placeholder: '', dom: 'bgqx', itemId: 6 },
                ],
                submitDataInfo_case: {
                    case_name: '',
                    case_desc: '',
                    tysah: '',
                    bmsah: '',
                    case_type_id: '',
                    case_take_user_name: '',
                },
                eachDataInfoList_case: [
                    { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'case_name', itemId: 1, type: 'input' },
                    { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                    { captionTitle: '案件描述', placeholder: '请输入案件描述', dom: 'case_desc', itemId: 3, type: 'textarea' },
                    { captionTitle: '承办人', placeholder: '请输入承办人', dom: 'case_take_user_name', itemId: 4, type: 'input' },
                    { captionTitle: '部门受案号', placeholder: '请输入部门受案号', dom: 'bmsah', itemId: 5, type: 'input' },
                    { captionTitle: '类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'select' },
                ],
                rules_addCase: {
                    case_name: [
                        { required: true, message: '请输入案件名称', trigger: 'blur' }
                    ],
                    case_take_user_name: [
                        { required: true, message: '请输入承办人', trigger: 'blur' }
                    ],
                    case_type_id: [
                        { required: true, message: '请选择案件类型', trigger: 'blur' }
                    ]
                },
                setDynamicBtn: [
                    { title: '新增案件', fun: 'addCaseItem' },
                    // { title: '导出', fun: 'exprotFun'}
                ],
            }
        },
        mounted(){
            this.getTypeList();
            this.getTableList(this.pagination);
        },
        methods: {
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCaseItem": "addCaseItem"
                }
                this[statusMap[data.fun]]()
            },
            // DialogPagin
            dialogTablePagin(data){
                this.showModel.gridData = data
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'selectOption_time', store: 'exhibit_time_bg' },
                    { showModel: 'selectOption_type', store: 'exhibit_type' },
                    { showModel: 'bgqx', store: 'exhibit_time_bg' },
                    { showModel: 'exhibit_type', store: 'exhibit_type' },
                    { showModel: 'case_type_id', store: 'case_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                this.showModel.dialogAddCaseVisible = false;
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
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getTableList(this.pagination)
            },
            // 导出
            openExportExcelFun(data){
                this.$nextTick(()=>{
                    // window.open(this.base_url+'/?'+exportExcelFun(data))
                })
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
                let resultData = await this.$api.printAgain({exhibit_id})
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 接收案卷信息
            receivedItem(case_id){
                this.showModel.dialogReceivedVisible = true;
                this.resetSubmitInfo();
                this.submitDataInfo.case_id = case_id;
            },
            //重置表单
            resetSubmitInfo(){
                for( let key in this.submitDataInfo){ this.submitDataInfo[key] = '' }
                this.submitDataInfo.nd = new Date().getFullYear()
                this.submitDataInfo.exhibit_type = this.showModel.selectOption_type[0].value;
                this.submitDataInfo.bgqx = this.showModel.selectOption_time[0].value;
            },
            //重置表单
            resetSubmitInfo_case(){
                for( let key in this.submitDataInfo_case){ this.submitDataInfo_case[key] = '' }
            },
            // 确认提交
            async confirmBtn(){
                ['print_code','print_accept'].map(item=> this.submitDataInfo[item] = Number(this.submitDataInfo[item]))
                let resultData = await this.$api.addExhibitData(this.submitDataInfo)
                if(resultData && resultData.code=='0'){
                    this.$message.success('添加成功')
                    this.getCaseType()
                    this.resetSubmitInfo()
                }
            },
            async addCaseItem(){
                this.showModel.dialogAddCaseVisible = true;
            },
            confirmAddCase(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let dataInfo = { ...this.submitDataInfo_case,case_bh: this.submitDataInfo_case.tysah }
                        let resultData = await this.$api.addCaseItemData(dataInfo)
                        if(resultData && resultData.code =='0') {
                            this.showModel.dialogAddCaseVisible = false;
                            this.$message.success('操作成功')
                        }
                    } else return false;
                })
            },
        },
    }
</script>
<style lang="scss">
    .historicalCasesPage{
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
        .checkboxSelect{
            padding: 15px 0 0 10%;;
        }
        .addCaseBox_container{
            display: inline-flex;
            width: 100%;
            .addCaseBox_item{
                width: 50%;
                .item{
                    display:table;
                    width: 100%;
                    margin-bottom: 10px;
                    >span{
                        display:table-cell;
                        width: 35%;
                        text-align: right;
                        padding-right: 20px;
                    }
                }
            }
        }
    }
</style>
