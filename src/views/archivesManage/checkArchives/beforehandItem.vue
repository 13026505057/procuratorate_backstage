<template>
    <div class="beforeHandItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab" @tab-click="handleClickTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.couNum" v-if="item.couNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" v-if="showModel.activeNameTab == '0'">
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 6">{{ row[item.title]=='none'?'未入库':'' }}{{ row[item.title]=='in'?'已入库':'' }}</span>
                                    <span v-else-if="item.itemId == 14">{{ row[item.title]=='SS'?'诉讼':'' }}{{ row[item.title]=='WS'?'文书':'' }}{{ row[item.title]=='JS'?'技术':'' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="120">
                                <template slot-scope="{row}">
                                    <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="table-dataList" v-if="showModel.activeNameTab == '1'">
                        <el-table :data="showModel.tableData_clickBtn" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns_notDone" :key="item.itemId" align="center"></el-table-column>
                        </el-table>
                    </div>
                    <div class="table-dataList" v-if="showModel.activeNameTab == '2'">
                        <el-table :data="showModel.tableData_unClickBtn" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns_notDone" :key="item.itemId" align="center"></el-table-column>
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
        <!-- 接收案卷 -->
        <el-dialog v-dialogDrag title="新增案卷" :visible.sync="showModel.dialogReceivedVisible">
            <el-form :inline="true" :model="submitDataInfo" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="案卷名称 " prop="exhibit_name">
                    <el-input class="input_class" v-model="submitDataInfo.exhibit_name"></el-input>
                </el-form-item>
                <el-form-item label="统一受案号" prop="tysah">
                    <el-input class="input_class" v-model="submitDataInfo.tysah"></el-input>
                </el-form-item>
                <el-form-item label="案由" prop="ay">
                    <el-input class="input_class" v-model="submitDataInfo.ay"></el-input>
                </el-form-item>
                <el-form-item label="承办人" prop="cbr">
                    <el-input class="input_class" v-model="submitDataInfo.cbr"></el-input>
                </el-form-item>
                <el-form-item label="案件类型" prop="case_type_id">
                    <el-select class="input_class" v-model="submitDataInfo.case_type_id" >
                        <el-option v-for="itemChild in selectOption.case_type_id" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </el-form-item>
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
                        <el-option v-for="itemChild in showModel.bgqx" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="案卷类型" prop="exhibit_type">
                    <el-select class="input_class" v-model="submitDataInfo.exhibit_type">
                        <el-option v-for="itemChild in showModel.exhibit_type" :key="itemChild.value" 
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
                        <el-option v-for="itemChild in showModel.exhibit_type" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                    <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.itemId == 6">
                        <el-option v-for="itemChild in showModel.bgqx" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select>
                </div> -->
                <div class="checkboxSelect">
                    <el-checkbox v-model="submitDataInfo.print_code" >同时打印案件条形码</el-checkbox>
                    <el-checkbox v-model="submitDataInfo.print_accept">同时打印收卷回执单</el-checkbox>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogReceivedVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { exportExcelFun } from '@/utils/auth'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','case_type','temporary_nd','print_id','base_url'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 1, name: 'input' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '请扫描案卷条码', itemId: 2, name: 'input' },
                    { dom: 'exhibit_name', value: '',placeholder: '请输入案件名', itemId: 3, name: 'input' },
                    { dom: 'nd', value: '',placeholder: '选择年份', itemId: 4, name: 'dataPicker' },
                    { dom: 'cbr', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'stock_status', value: '',placeholder: '是否入库', itemId: 6, name: 'select' },
                ],
                selectOption: {
                    stock_status: [
                        { value: 'none', label: '未入库' },
                        { value: 'in', label: '已入库' },
                    ],
                    case_type_id: [],
                },
                showModel: {
                    activeNameTab: "0",
                    tableList:[
                        { case_type_id: '0', case_type_name: '案件预入库', couNum: 0 },
                        { case_type_id: '1', case_type_name: '未办结(点击办结按钮)', couNum: 0 },
                        { case_type_id: '2', case_type_name: '未办结(未点击办结按钮)', couNum: 0 },
                    ],
                    tableData:[],   // 数据信息
                    tableData_clickBtn:[],   // 数据信息
                    tableData_unClickBtn:[],   // 数据信息
                    // 新增案件
                    dialogReceivedVisible: false,
                    exhibit_type: [],
                    bgqx: [],
                    case_type_id: []
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 11 },
                    { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 14 },
                    { title: 'bgqx', dataIndex: '保管期限', itemId: 15 },
                    { title: 'bgr', dataIndex: '嫌疑人', itemId: 12 },
                    { title: 'cbr', dataIndex: '承办人', itemId: 13 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 8 },
                    { title: 'cell_name', dataIndex: '存储位置', itemId: 3 },
                    { title: 'nd', dataIndex: '年度', itemId: 5 },
                    { title: 'stock_status', dataIndex: '入库状态', itemId: 6 },
                    // { title: 'case_type_name', dataIndex: '隶属案件类型', itemId: 7 },
                ],
                // table表头（未完成）
                columns_notDone: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 11 },
                    { title: 'ajlb_mc', dataIndex: '案件类型', itemId: 14 },
                    { title: 'case_desc', dataIndex: '案件描述', itemId: 2, overflow: true },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 12 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 13 },
                    { title: 'bjrq', dataIndex: '办结按钮点击日期', itemId: 5 },
                ],
                setDynamicBtn: [
                    { title: '新增案卷', fun: 'addCaseItem' },
                    { title: '导出', fun: 'exportCaseItem' }
                ],
                submitDataInfo: {
                    nd: '',
                    exhibit_type: '',
                    bgqx: '',
                    dh: '',
                    jh: '',
                    bgr: '',
                    exhibit_name:'',
                    tysah:'',
                    ay:'',
                    case_type_id:'30',
                    cbr:'',
                    print_code: true,
                    print_accept: false
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
            }
        },
        mounted(){
            this.selectOption.case_type_id = this.case_type;
            this.getTableList(this.pagination);
            this.getTableList_clickBtn(this.pagination);
            this.getTableList_unClickBtn(this.pagination);
            this.getTypeList();
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCaseItem": "addCaseItem",
                    "exportCaseItem":'exportCaseItem'
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            exportCaseItem(data){
                this.$nextTick(()=>{
                    window.open(this.base_url+'/exhibit/exhibit/exoprtYrExhibits?'+exportExcelFun(data))
                })
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                let mapRequestFun = {
                    "0": "getTableList",
                    "1": "getTableList_clickBtn",
                    "2": "getTableList_unClickBtn",
                }
                this[mapRequestFun[this.showModel.activeNameTab]](this.pagination)
            },
            handleClickTab(e){
                let mapRequestFun = {
                    "0": "getTableList",
                    "1": "getTableList_clickBtn",
                    "2": "getTableList_unClickBtn",
                }
                this.pagination.pageNum = 1;
                this[mapRequestFun[e.paneName]](this.pagination)
            },
            // 预入库作废按钮
            deleteCancel(dataInfo){
                const self = this;
                this.$confirm('确定作废？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    self.deleteCancelRequest(dataInfo);
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });     
                });       
            },
            // 预入库作废请求
            async deleteCancelRequest(dataInfo){
                const sendData = {};
                sendData ['exhibit_id'] = dataInfo;
                sendData ['exhibit_status'] = '0';
                const resultData = await this.$api.undateYrExhibit(sendData);
                if(resultData && resultData.code =='0') {
                    this.$message.success('操作成功');
                    this.getTableList(this.pagination);
                }
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.yrExhibitGetByPage(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                this.showModel.tableList[0].couNum = pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 获取未办结案件列表(点击按钮)
            async getTableList_clickBtn(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getFromShouliBanJieNoInCases(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData_clickBtn = resultData.data.list;
                this.showModel.tableList[1].couNum = pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 获取未办结案件列表(未点击按钮)
            async getTableList_unClickBtn(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getFromShouliWeiBanJieNoInCases(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData_unClickBtn = resultData.data.list;
                this.showModel.tableList[2].couNum = pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                let mapRequestFun = {
                    "0": "getTableList",
                    "1": "getTableList_clickBtn",
                    "2": "getTableList_unClickBtn",
                }
                this[mapRequestFun[this.showModel.activeNameTab]](this.pagination)
            },
            async addCaseItem(){
                this.resetSubmitInfo();
                this.showModel.dialogReceivedVisible = true;
            },
            async confirmAddCase(){
                ['print_code','print_accept'].map(item=> this.submitDataInfo[item] = Number(this.submitDataInfo[item])) || 0
                this.submitDataInfo ['province_id'] = this.pagination.province_id;
                this.submitDataInfo ['city_id'] = this.pagination.city_id;
                this.submitDataInfo ['area_id'] = this.pagination.area_id;
                this.submitDataInfo ['print_id'] = this.print_id;
                let resultData = await this.$api.yrExhibitAdd(this.submitDataInfo)
                if(resultData && resultData.code =='0') {
                    localStorage.setItem('yr_case_type_id',this.submitDataInfo.case_type_id)
                    localStorage.setItem('yr_nd',this.submitDataInfo.nd)
                    localStorage.setItem('yr_exhibit_type',this.submitDataInfo.exhibit_type)
                    localStorage.setItem('yr_bgqx',this.submitDataInfo.bgqx)
                    this.showModel.dialogReceivedVisible = false;
                    this.$message.success('操作成功');
                    this.resetSubmitInfo();
                    this.getTableList(this.pagination);
                }
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'bgqx', store: 'exhibit_time_bg' },
                    { showModel: 'exhibit_type', store: 'exhibit_type' },
                    { showModel: 'case_type_id', store: 'case_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            confirmBtn(){
                this.confirmAddCase()
            },
            //重置表单
            resetSubmitInfo(){
                for( let key in this.submitDataInfo){ this.submitDataInfo[key] = '' }
                this.submitDataInfo.print_code = true;
                this.submitDataInfo.exhibit_type = localStorage.getItem('yr_exhibit_type');
                this.submitDataInfo.bgqx = localStorage.getItem('yr_bgqx')
                this.submitDataInfo.nd = localStorage.getItem('yr_nd') || new Date().getFullYear()
                this.submitDataInfo.case_type_id = localStorage.getItem('yr_case_type_id')
            },
        },
    }
</script>
<style lang="scss">
    .beforeHandItemPage{
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
            width: 100%;
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
