<template>
    <div class="bindReadyItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'exhibit'" :hiddenAdress="true"
            @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="pagination.total" v-if="pagination.total == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 6">{{ row[item.title]=='none'?'未入库':(row[item.title]=='in'?'已入库':'') }}</span>
                                    <span v-else-if="item.itemId == 14">{{ row[item.title] | mapStatus }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="300">
                                <template slot-scope="{row}">
                                    <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                                    <el-button @click="showDialogPanel({ tysah: row.tysah, case_name: row.exhibit_name, cbr: row.cbr, bgr:row.bgr },row.exhibit_id)" class="highlight-btn" size="small">绑定案件</el-button>
                                    <el-button @click="addCaseDialogPanel({ tysah: row.tysah, bmsah: row.bmsah,case_name: row.exhibit_name, case_take_user_name: row.cbr },row.exhibit_id)" class="highlight-btn" size="small">新增案件</el-button>
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
        <!-- 案件列表 -->
        <el-dialog v-dialogDrag title="案件列表" :visible.sync="showModel.dialogTableVisible" width="70%">
            <Search :addSearch="mergeData.addSearch" :selectOption="mergeData.selectOption" :resetData="true" 
                @comfirmSearch="comfirmSearch_merge" :hiddenAdress="false"/>
            <!-- 已入库案件 -->
            <template>
                <p>符合归档条件案件:</p>
                <el-table :data="showModel.gridData_yrk" align="center" v-loading="loadingTable_merge">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                        v-for="item in showModel.gridData_columns_yrk" :key="item.itemId" align="center">
                        <template slot-scope="{row}">
                            <span v-if="item.itemId == 5">{{ row[item.title]=='0'?'未交卷':'已交卷' }}</span>
                            <span v-else>{{ row[item.title] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{row}">
                            <el-button @click="bindCaseDataClick_yrk(row.case_id)" class="highlight-btn" type="operation" size="small">绑定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination small background
                    style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                    @current-change="handleCurrentChange_merge_yrk" :current-page.sync="pagination_merge_yrk.pageNum"
                    :page-size="pagination_merge_yrk.pageSize" layout="prev, pager, next, jumper"
                    :total="pagination_merge_yrk.total">
                </el-pagination>
            </template>
            <!-- 已受理案件 -->
            <template>
                <p>已受理案件:</p>
                <el-table :data="showModel.gridData_ysl" align="center" v-loading="loadingTable_merge">
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                        v-for="item in showModel.gridData_columns_ysl" :key="item.itemId" align="center">
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{row}">
                            <el-button @click="bindCaseDataClick_ysl(row.bmsah,row.over_time)" class="highlight-btn" type="operation" size="small">绑定</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination small background
                    style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                    @current-change="handleCurrentChange_merge_ysl" :current-page.sync="pagination_merge_ysl.pageNum"
                    :page-size="pagination_merge_ysl.pageSize" layout="prev, pager, next, jumper"
                    :total="pagination_merge_ysl.total">
                </el-pagination>
            </template>
        </el-dialog>
        <!-- 已受理案件绑定弹窗 -->
        <el-dialog v-dialogDrag title="已受理案件绑定" :visible.sync="ysldet" @close="resetSubmitInfo_case">
              <el-form :model="ruleForm" :rules="rulesForm" ref="rulesForm" label-width="130px" class="demo-ruleForm">
                <el-form-item label="实质办结日期" prop="over_time">
                     <el-date-picker v-model="ruleForm.over_time" type="datetime" placeholder="请选择办结日期"
                            value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
                </el-form-item>
                <el-form-item >
                      <el-button @click="Todetais('rulesForm')"> 确定</el-button>
                </el-form-item>
              </el-form>
        </el-dialog>
        <!-- 新增案件 -->
        <el-dialog v-dialogDrag title="新增案件" :visible.sync="showModel.dialogAddCaseVisible" @close="resetSubmitInfo_case">
            <el-form :model="submitDataInfo_case" :rules="rules_addCase" ref="ruleForm" label-width="20%" class="demo-ruleForm">
                <template v-for="item in eachDataInfoList_case">
                    <el-form-item :label="item.captionTitle" :prop="item.dom">
                        <el-input v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-if="item.type == 'input'"></el-input>
                        <el-input v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" type="textarea" v-else-if="item.type == 'textarea'"></el-input>
                        <el-select v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                        <el-cascader
                                :options="showModels"
                                :props="{ checkStrictly: true }"
                                v-model="submitDataInfo_case[item.dom]"
                                clearable
                                v-else-if="item.type == 'cascader'">
                        </el-cascader>
                        <el-date-picker v-model="submitDataInfo_case[item.dom]"  :placeholder="item.placeholder"  v-else-if="item.type == 'picker'"
                            value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="showModel.dialogAddCaseVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddCase('ruleForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
                    <!-- <el-select class="input_class" v-model="submitDataInfo.case_type_id" >
                        <el-option v-for="itemChild in selectOption.case_type_id" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value"></el-option>
                    </el-select> -->
                    <el-cascader
                                :options="showModels"
                                :props="{ checkStrictly: true }"
                                v-model="submitDataInfo.case_type_id"
                                clearable
                                >
                    </el-cascader>
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
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','org_id','depList','case_type','print_id'])
        },
        filters: {
            mapStatus(status){
                let mapList = {
                    "SS": "诉讼",
                    "WS": "文书",
                    "JS": "技术"
                }
                return mapList[status]
            }
        },
        data()  {
            return  {
                ruleForm:{
                    over_time:'',
                },
                
                bmsah:'',
                ysldet:false,
                showModels:[],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'stock_status', value: '',placeholder: '是否已入库', itemId: 6, name: 'select' },
                ],
                selectOption: {
                    stock_status: [
                        { value: 'none', label: '未入库' },
                        { value: 'in', label: '已入库' },
                    ],
                    case_type_id: [],
                },
                setDynamicBtn: [
                    { title: '新增案卷', fun: 'addCaseItem' },
                    { title: '导出', fun: 'exportCaseItem' }
                ],
                showModel: {
                    activeNameTab: "0",
                    tableList:[
                        { case_type_id: '0', case_type_name: '预入库待绑定' }
                    ],   // 类型
                    tableData:[],   // 数据信息
                    // 案件列表
                    dialogTableVisible: false,
                    gridData_yrk: [], // 已入库信息
                    gridData_ysl: [], // 已受理信息
                    gridData_columns_yrk: [
                        { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                        { title: 'bmsah', dataIndex: '部门受案号', itemId: 10 },
                        { title: 'case_name', dataIndex: '案件名称', itemId: 2 },
                        { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                        { title: 'case_type_name', dataIndex: '案件类型', itemId: 4 },
                        { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                        { title: 'dangan_accept_status', dataIndex: '是否交卷', itemId: 5 },
                        { title: 'dangan_accept_time', dataIndex: '交卷日期', itemId: 6 },
                        { title: 'dangan_accept_day', dataIndex: '交卷天数', itemId: 7 },
                    ],
                    gridData_columns_ysl: [
                        { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                        { title: 'bmsah', dataIndex: '部门受案号', itemId: 10 },
                        { title: 'case_name', dataIndex: '案件名称', itemId: 2 },
                        { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                        { title: 'ajlb_mc', dataIndex: '案件类型', itemId: 4 },
                        { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    ],
                    // 新增案件
                    dialogAddCaseVisible: false,
                    // 新增案卷
                    dialogReceivedVisible: false,
                    dept_id: []
                },
                submitDataInfo_case: {
                    case_name: '',
                    case_desc: '',
                    tysah: '',
                    bmsah: '',
                    case_type_id: '',
                    case_take_user_name: '',
                    dept_id: '',
                    slrq:'',
                    over_time:''
                },
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
                rulesForm:{
                    over_time:[
                        { required: true, message: '请选择日期', trigger: 'blur' },
                    ],
                },
                rules: {
                    exhibit_name:[
                        { required: true, message: '请输入案卷名称', trigger: 'blur' },
                    ],
                    nd: [
                        { required: true, message: '请输入年度', trigger: 'blur' },
                        { min: 4, max: 4, message: '年份输入错误', trigger: 'blur' },
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    dh: [
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    jh: [
                        { required: true, message: '请输入卷号', trigger: 'blur' },
                        { pattern: /^\d+$|^\d+[.]?\d+$/, message: '只能输入数字', trigger: 'blur' }
                    ],
                    bgr: [
                         { required: true, message: '请输入被告人', trigger: 'blur' },
                    ],
                    exhibit_type: [
                        { required: true, message: '请选择案卷类型', trigger: 'blur' }
                    ],
                    bgqx: [
                        { required: true, message: '请选择保管期限', trigger: 'blur' }
                    ]
                },
                eachDataInfoList_case: [
                    { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                    { captionTitle: '部门受案号', placeholder: '请输入部门受案号', dom: 'bmsah', itemId: 5, type: 'input' },
                    { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'case_name', itemId: 1, type: 'input' },
                    { captionTitle: '案件描述', placeholder: '请输入案件描述', dom: 'case_desc', itemId: 3, type: 'textarea' },
                    { captionTitle: '案件类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'cascader' },
                    { captionTitle: '承办人', placeholder: '请输入承办人', dom: 'case_take_user_name', itemId: 4, type: 'input' },
                    { captionTitle: '承办部门', placeholder: '请选择承办部门', dom: 'dept_id', itemId: 6, type: 'select' },
                    { captionTitle: '受理日期', placeholder: '请选择受理日期', dom: 'slrq', itemId: 7, type: 'picker' },
                    { captionTitle: '实质办结日期', placeholder: '请选择实质办结日期', dom: 'over_time', itemId: 8, type: 'picker' },
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
                    ],
                    dept_id: [
                        { required: true, message: '请选择承办部门', trigger: 'blur' }
                    ],
                    slrq: [
                        { required: true, message: '请选择受理日期', trigger: 'blur' }
                    ],
                    over_time: [
                        { required: true, message: '实质办结日期', trigger: 'blur' }
                    ],
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 12 },
                    { title: 'ay', dataIndex: '案由', itemId: 7 },
                    { title: 'bgr', dataIndex: '嫌疑人', itemId: 15 },
                    { title: 'bgqx', dataIndex: '保管期限', itemId: 13 },
                    { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 14 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 8 },
                    { title: 'cbr', dataIndex: '承办人', itemId: 11 },
                    { title: 'yr_case_type_name', dataIndex: '预入库案卷类型', itemId: 16 },
                    { title: 'cell_name', dataIndex: '存储位置', itemId: 3 },
                    { title: 'nd', dataIndex: '年度', itemId: 5 },
                    { title: 'stock_status', dataIndex: '入库状态', itemId: 6 },
                ],
                mergeData: {
                    addSearch: [
                        { dom: 'tysah', value: '',placeholder: '统一受案号', itemId: 1, name: 'input' },
                        { dom: 'case_name', value: '',placeholder: '案件名称', itemId: 2, name: 'input' },
                        { dom: 'case_take_user_name', value: '',placeholder: '承办人', itemId: 3, name: 'input' },
                        { dom: 'bgr', value: '',placeholder: '嫌疑人', itemId: 4, name: 'input' },
                    ],
                    selectOption: {},
                },
                loadingTable_merge: false,
                pagination_merge_yrk: {
                    pageNum: 1,
                    pageSize: 10,
                    tysah: '',
                    case_name: '',
                    case_take_user_name: '',
                    bgr:'',
                    org_id: ''
                },
                pagination_merge_ysl: {
                    pageNum: 1,
                    pageSize: 10,
                    tysah: '',
                    case_name: '',
                    case_take_user_name: '',
                    bgr:'',
                    org_id: ''
                },
                bindCaseData: {
                    exhibit_id: '',
                    case_id: ''
                }
            }
        },
        mounted(){
            this.selectOption.case_type_id = this.case_type;
            this.pagination_merge_ysl.org_id = this.pagination_merge_yrk.org_id = this.org_id
            this.getTableList(this.pagination)
            this.getTypeList()
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> {
                    this.pagination[item] = data[item]
                    this.pagination_merge_yrk[item] = this.pagination_merge_ysl[item] = data[item]
                } )
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCaseItem": "addCaseItem",
                    "exportCaseItem":'exportCaseItem'
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            // 新增案卷
            async addCaseItem(){
                this.resetSubmitInfo();
                this.showModel.dialogReceivedVisible = true;
                this.$api.getcasetype(this.org_id).then(res=>{
                     let arr = []
                    res.data.map((item,index)=>{
                    arr.push({value:item.case_type_id,label:item.case_type_name,children:[]})
                      item.caseTypes.map(it=>{
                          arr[index].children.push({value:it.case_type_id,label:it.case_type_name}) 
                      })
                    
                    })
                     this.showModels = arr
                })
            },
            exportCaseItem(data){
                this.$nextTick(()=>{
                    window.open(this.base_url+'/exhibit/exhibit/exoprtYrExhibits?'+exportExcelFun(data))
                })
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
            // 新增案卷
            confirmBtn(){
                this.confirmAddExhibit()
            },
            async confirmAddExhibit(){
                ['print_code','print_accept'].map(item=> this.submitDataInfo[item] = Number(this.submitDataInfo[item])) || 0
                this.submitDataInfo ['province_id'] = this.pagination.province_id;
                this.submitDataInfo ['city_id'] = this.pagination.city_id;
                this.submitDataInfo ['area_id'] = this.pagination.area_id;
                this.submitDataInfo ['print_id'] = this.print_id;
                console.log('this.submitDataInfo.case_type_id')
                console.log(this.submitDataInfo.case_type_id)
                this.submitDataInfo.case_type_id =  this.submitDataInfo.case_type_id
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
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            // 分页_弹窗_已入库
            handleCurrentChange_merge_yrk(val) {
                this.pagination_merge_yrk['pageNum'] = val;
                this.getWasInHouseList(this.pagination_merge_yrk)
            },
            // 分页_弹窗_已受理
            handleCurrentChange_merge_ysl(val) {
                this.pagination_merge_ysl['pageNum'] = val;
                this.getWasShouLiList(this.pagination_merge_ysl)
            },
            // 预入库作废按钮
            deleteCancel(dataInfo){
                this.$confirm('确定作废？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => { this.deleteCancelRequest(dataInfo) })
                .catch(() => { this.$message.info('已取消') });       
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
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false; 
                this.$nextTick()
                const sendData = dataInfo;
                sendData ['nd'] =  dataInfo.nd;
                const resultData = await this.$api.yrExhibitGetByPage(sendData);
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
                this.getTableList(this.pagination)
            },
            // 确认搜索
            comfirmSearch_merge(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_merge_yrk[key] = this.pagination_merge_ysl[key] = data[key] } })
                this.getWasInHouseList(this.pagination_merge_yrk)
                this.getWasShouLiList(this.pagination_merge_ysl)
            },
            showDialogPanel(dataInfo,exhibit_id){
                this.showModel.dialogTableVisible = true;
                this.bindCaseData.exhibit_id = exhibit_id;
                ['tysah','case_name','cbr','bgr'].map((item,index)=>{
                    this.mergeData.addSearch[index].value = dataInfo[item];
                    this.pagination_merge_yrk[item] = this.pagination_merge_ysl[item] = dataInfo[item];
                })
                this.getWasInHouseList(this.pagination_merge_yrk)
                this.getWasShouLiList(this.pagination_merge_ysl)
            },
            // 获取已入库案件信息
            async getWasInHouseList(dataInfo){
                this.loadingTable_merge = true;
                const resultData = await this.$api.getConfirmedByPage(dataInfo);
                const pagination = { ...this.pagination_merge_yrk };
                this.showModel.gridData_yrk = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_merge_yrk = pagination;
                this.loadingTable_merge = false;
            },
            // 获取已受理案件信息
            async getWasShouLiList(dataInfo){
                this.loadingTable_merge = true;
                const resultData = await this.$api.casesShouliGetByPage(dataInfo);
                const pagination = { ...this.pagination_merge_ysl };
                this.showModel.gridData_ysl = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_merge_ysl = pagination;
                this.loadingTable_merge = false;
            },
            // 已受理绑定
            bindCaseDataClick_ysl(bmsah,over_time){
                this.ysldet = true
                this.bmsah = bmsah
                // this.bindCaseDataRequest_ysl(bmsah,over_time);
            },
            Todetais(formName){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.bindCaseDataRequest_ysl()
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            async bindCaseDataRequest_ysl(){
            
                let dataInfo = {
                    exhibit_id: this.bindCaseData.exhibit_id, bmsah: this.bmsah,over_time:this.ruleForm.over_time
                }
                let resultData = await this.$api.attachExhibitToShouliCase(dataInfo)
                if(resultData && resultData.code == '0'){
                    this.showModel.dialogTableVisible = false;
                    this.$message.success('操作成功');
                    this.ysldet = false
                    this.getTableList(this.pagination);
                } 
            },
            // 已入库绑定
            bindCaseDataClick_yrk(case_id){
                this.bindCaseDataRequest_yrk(case_id);
            },
            async bindCaseDataRequest_yrk(case_id){
                this.bindCaseData.case_id = case_id;
                let resultData = await this.$api.attachExhibitToCase(this.bindCaseData)
                if(resultData && resultData.code == '0'){
                    this.showModel.dialogTableVisible = false;
                    this.$message.success('操作成功');
                    this.getTableList(this.pagination);
                } 
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'case_type_id', store: 'case_type' },
                    { showModel: 'dept_id', store: 'depList' },
                    { showModel: 'bgqx', store: 'exhibit_time_bg' },
                    { showModel: 'exhibit_type', store: 'exhibit_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            // 新增案件
            addCaseDialogPanel(dataInfo,exhibit_id){
                Object.keys(this.submitDataInfo_case).map(item=> this.submitDataInfo_case[item] = dataInfo[item] )
                this.showModel.dialogAddCaseVisible = true
                this.bindCaseData.exhibit_id = exhibit_id
                this.$api.getcasetype(this.org_id).then(res=>{
                     let arr = []
                    res.data.map((item,index)=>{
                    arr.push({value:item.case_type_id,label:item.case_type_name,children:[]})
                      item.caseTypes.map(it=>{
                          arr[index].children.push({value:it.case_type_id,label:it.case_type_name}) 
                      })
                    
                    })
                     this.showModels = arr
                })
            },
            //重置表单
            resetSubmitInfo_case(){
                for( let key in this.submitDataInfo_case){ this.submitDataInfo_case[key] = '' }
            },
            confirmAddCase(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        console.log(this.submitDataInfo_case.case_type_id)
                        this.submitDataInfo_case.case_type_id = this.submitDataInfo_case.case_type_id.pop()
                        let dataInfo = { ...this.submitDataInfo_case,case_bh: this.submitDataInfo_case.tysah }
                        let resultData = await this.$api.addCaseItemData(dataInfo)
                        if(resultData && resultData.code =='0') {
                            this.bindCaseDataRequest_yrk(resultData.data.case_id)
                            this.showModel.dialogAddCaseVisible = false;
                        }
                    } else return false;
                })
            },
        }
    }
</script>
<style lang="scss">
    .bindReadyItemPage{
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
    }
</style>
