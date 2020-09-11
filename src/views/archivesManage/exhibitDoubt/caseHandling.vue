<template>
    <div class="caseHandling">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'case'" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab">
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
                                    <span v-if="item.itemId == 5">{{ row[item.title] == '1'?'已交卷':'未交卷' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column align="center" label="操作">
                                <template slot-scope="{row}">
                                    <el-button @click="showDialogPanel(row.case_bh,row.case_id,row.bmsah,row.case_name,row.case_take_user_name,row.is_and_case)" class="highlight-btn" size="small">拆卷</el-button>
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                align="center"
                                label="操作">
                                <template slot-scope="{ row }">
                                    <el-button @click="addUnitClick('update',row)" class="ash-btn" size="small">修改</el-button>
                                    <!-- <el-popconfirm
                                        icon="el-icon-info"
                                        iconColor="red"
                                        title="确定删除吗？"
                                        @onConfirm = "confirmDel"
                                        >
                                        <el-button slot="reference" @click="delUnitClick(row.case_id)" class="highlight-btn" size="small">删除</el-button>
                                    </el-popconfirm> -->
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
        <!-- 新增案件 -->
        <el-dialog v-dialogDrag :title="caseTitle" :visible.sync="showModel.dialogAddCaseVisible" @close="resetSubmitInfo_case">
            <el-form :model="submitDataInfo_case" :rules="rules_addCase" ref="ruleForm" label-width="20%" class="demo-ruleForm">
                <template v-for="item in eachDataInfoList_case">
                    <el-form-item :label="item.captionTitle" :prop="item.dom">
                        <el-input class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-if="item.type == 'input'"></el-input>
                        <el-input class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" type="textarea" v-else-if="item.type == 'textarea'"></el-input>
                        <el-select class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
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
                        <el-date-picker v-model="submitDataInfo_case[item.dom]" type="datetime" :placeholder="item.placeholder"  v-if="item.type == 'time'"
                            value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button @click="showModel.dialogAddCaseVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmAddCase('ruleForm')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 案件列表 -->
        <el-dialog v-dialogDrag title="案件列表" :visible.sync="showModel.dialogTableVisible" width="70%">
            <!-- <Search :addSearch="mergeData.addSearch" :selectOption="mergeData.selectOption" :resetData="true" 
                @comfirmSearch="comfirmSearch_merge" :hiddenAdress="false"/> -->
            <el-table :data="showModel.gridData" align="center" v-loading="loadingTable_merge">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 8">{{row[item.title] == 1?"主卷":(row[item.title] == 0?"副卷":"")}}</span>
                        <span v-else>{{row[item.title]}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="{row}">
                         <!-- v-if="submiteDataInfo.weigui_case_id==row.case_id?false:true" -->
                        <el-button @click="mergeCase(row.case_id)" class="highlight-btn" type="operation" size="small">拆卷</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination small background
                style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                @current-change="handleCurrentChange_merge" :current-page.sync="pagination_merge.pageNum"
                :page-size="pagination_merge.pageSize" layout="prev, pager, next, jumper"
                :total="pagination_merge.total">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import DialogPagin from '@/components/DialogPagin'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search,DialogPagin },
        computed :{
            ...mapGetters(['exhibit_type','case_type','exhibit_time_bg','depList','org_id'])
        },
        data()  {
            return  {
                showModels:[],
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    weila_status: "NULL", 
                    shoudong_status: 1,
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'case_none_status', value: '',placeholder: '是否已交卷', itemId: 6, name: 'select' },
                ],
                selectOption: {
                    case_none_status: [
                        { value: 1, label: '未交卷' },
                        { value: 2, label: '已交卷(未上架)' },
                    ],
                    case_type_id: [],
                },
                setDynamicBtn:[
                    { title:"新增案件", fun:"addCaseItem"}
                ],
                showModel: {
                    activeNameTab: "0",
                    tableList:[{
                        case_type_id:"0",
                        case_type_name:"新增案件处理"
                    }],   // 类型
                    tableData:[],   // 数据信息
                    // 案件列表
                    dialogTableVisible: false,
                    gridData: [],
                    gridData_columns: [
                        { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                        { title: 'bmsah', dataIndex: '部门受案号', itemId: 2 },
                        { title: 'case_name', dataIndex: '案件名称', itemId: 3 },
                        { title: 'case_desc', dataIndex: '案件描述', itemId: 4, overflow: true },
                        { title: 'case_take_user_name', dataIndex: '承办人', itemId: 5 },
                        { title: 'bgr', dataIndex: '嫌疑人', itemId: 6 },
                        { title: 'case_type_name', dataIndex: '案件类型', itemId: 7 },
                        { title: 'is_and_case_root', dataIndex: '是否主卷', itemId: 8 },
                    ],
                    // 新增案件
                    dialogAddCaseVisible: false,
                    case_type_id:[],
                },
                submitDataInfo_case: {
                    case_name: '',
                    case_desc: '',
                    tysah: '',
                    bmsah: '',
                    case_type_id: '',
                    case_take_user_name: '',
                    dept_id: '',
                    case_id: '',
                    slrq:'',
                    over_time:''
                },
                eachDataInfoList_case: [
                    { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                    { captionTitle: '部门受案号', placeholder: '请输入部门受案号', dom: 'bmsah', itemId: 5, type: 'input' },
                    { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'case_name', itemId: 1, type: 'input' },
                    { captionTitle: '案件描述', placeholder: '请输入案件描述', dom: 'case_desc', itemId: 3, type: 'textarea' },
                    { captionTitle: '案件类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'cascader' },
                    { captionTitle: '承办人', placeholder: '请输入承办人', dom: 'case_take_user_name', itemId: 4, type: 'input' },
                    { captionTitle: '承办部门', placeholder: '请选择承办部门', dom: 'dept_id', itemId: 6, type: 'select' },
                    { captionTitle: '受理日期', placeholder: '请选择受理日期', dom: 'slrq', itemId: 7, type: 'time' },
                    { captionTitle: '实质办结日期', placeholder: '请选择实质办结日期', dom: 'over_time', itemId: 8, type: 'time' },
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
                    slrq:[
                        { required: true, message: '请选择受理日期', trigger: 'blur' }
                    ],
                    over_time:[
                        { required: true, message: '请选择实质办结日期', trigger: 'blur' }
                    ]
                },
                // table表头
                columns: [
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
                mergeData: {
                    addSearch: [
                        { dom: 'case_bh', value: '',placeholder: '统一受案号', itemId: 1, name: 'input' },
                        { dom: 'bmsah', value: '',placeholder: '部门受案号', itemId: 4, name: 'input' },
                        { dom: 'case_name', value: '',placeholder: '案件名称', itemId: 2, name: 'input' },
                        { dom: 'case_take_user_name', value: '',placeholder: '承办人', itemId: 5, name: 'input' },
                        // { dom: 'case_zm', value: '',placeholder: '', itemId: 4, name: 'select' },
                    ],
                    selectOption: {},
                },
                type:'',
                caseTitle:'',
                bindCaseData: {
                    exhibit_id: '',
                    case_id: ''
                },
                loadingTable_merge: false,
                pagination_merge: {
                    pageNum: 1,
                    pageSize: 10,
                    case_bh: '',
                    case_name: '',
                },
                submiteDataInfo: {}
            }
        },
        mounted(){
            this.selectOption.case_type_id = this.case_type;
            // this.showModel.case_type_id = this.case_type;
            // console.log(this.case_type)
            this.getTableList(this.pagination);
            this.getTypeList()
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> {
                    this.pagination[item] = data[item]
                    this.pagination_merge[item] = data[item]
                } )
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            handleCurrentChange_merge(val) {
                this.pagination_merge['pageNum'] = val;
                this.getWasInHouseList(this.pagination_merge)
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCaseItem": "addCaseItem",
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            addCaseItem(dataInfo){
                this.type = "add";
                this.caseTitle = "新增案件";
                Object.keys(this.submitDataInfo_case).map(item=> this.submitDataInfo_case[item] = dataInfo[item] )
                this.showModel.dialogAddCaseVisible = true
                this.$api.getcasetype(this.org_id).then(res=>{
                     let arr = []
                    res.data.map((item,index)=>{
                    arr.push({value:item.case_type_id,label:item.case_type_name,children:[]})
                      item.caseTypes.map(it=>{
                          arr[index].children.push({value:it.case_type_id,label:it.case_type_name}) 
                      })
                    
                    })
                     this.showModels = arr
                     console.log("案件类型")
                     console.log(arr)
                })
            },
            //重置表单
            resetSubmitInfo_case(){
                for( let key in this.submitDataInfo_case){ this.submitDataInfo_case[key] = '' }
            },
            confirmAddCase(formName){
                if(this.type == "add"){
                    this.$refs[formName].validate(async (valid) => {
                        if (valid) {
                            this.submitDataInfo_case.case_type_id = this.submitDataInfo_case.case_type_id.pop()
                            let dataInfo = { ...this.submitDataInfo_case,case_bh: this.submitDataInfo_case.tysah }
                            let resultData = await this.$api.addCaseItemData(dataInfo)
                            if(resultData && resultData.code =='0') {
                                this.$message.success('操作成功');
                                this.getTableList(this.pagination);
                                this.showModel.dialogAddCaseVisible = false;
                            }
                        } else return false;
                    })
                }else if(this.type == "update"){
                    this.$refs[formName].validate(async (valid) => {
                        if (valid) {
                            this.submitDataInfo_case.case_type_id = this.submitDataInfo_case.case_type_id.pop()
                            let dataInfo = { ...this.submitDataInfo_case,case_bh: this.submitDataInfo_case.tysah }
                            let resultData = await this.$api.updateCaseItemData(dataInfo)
                            if(resultData && resultData.code =='0') {
                                this.$message.success('操作成功');
                                this.getTableList(this.pagination);
                                this.showModel.dialogAddCaseVisible = false;
                            }
                        } else return false;
                    })
                }
                
            },
            async bindCaseDataRequest_yrk(case_id){
                this.bindCaseData.case_id = case_id;
                let resultData = await this.$api.attachExhibitToCase(this.bindCaseData)
                if(resultData && resultData.code == '0'){
                    this.showModel.dialogTableVisible = false; 
                } 
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'case_type_id', store: 'case_type' },
                    { showModel: 'dept_id', store: 'depList' },
                    // { showModel: 'bgqx', store: 'exhibit_time_bg' },
                    // { showModel: 'exhibit_type', store: 'exhibit_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            // DialogPagin
            dialogTablePagin(data){
                this.showModel.gridData = data
            },
            
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getDismantleList(dataInfo);
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
                this.$nextTick(()=>{ for(let key in data){ this.pagination_merge[key] = data[key] } })
                this.getWasInHouseList(this.pagination_merge)
            },
            showDialogPanel(case_bh,case_id,bmsah,case_name,case_take_user_name,is_and_case){
                this.showModel.dialogTableVisible = true;
                // this.mergeData.addSearch[0].value = case_bh;
                // this.mergeData.addSearch[2].value = bmsah;
                // this.pagination_merge.case_take_user_name = case_take_user_name;
                // this.pagination_merge.bmsah = bmsah;
                // this.pagination_merge.case_bh = case_bh;
                // this.pagination_merge.case_name = case_name;
                this.pagination_merge.is_and_case = is_and_case;
                // this.submiteDataInfo.weigui_case_id = case_id;
                this.getWasInHouseList(this.pagination_merge)
            },
            addUnitClick(type,row){
                this.type = type;
                this.caseTitle = "修改案件";
                Object.keys(this.submitDataInfo_case).map(item=> this.submitDataInfo_case[item] = row[item] )
                this.showModel.dialogAddCaseVisible = true;
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
            // 删除
            delUnitClick(case_id){
                this.case_id = case_id
            },
            async confirmDel(){
                const dataInfo = {case_id: this.case_id}
                const resultData = await this.$api.delCaseItemData(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                if(((this.total1-1)%(this.pageSize))==0) this.currentPage1-=1 
                this.getTableList(this.pagination);
            },
            // 获取已入库案件信息
            async getWasInHouseList(dataInfo){
                this.loadingTable_merge = true;
                // dataInfo ['dangan_accept_status'] = '1'; 
                const resultData = await this.$api.getDismantleList(dataInfo);
                const pagination = { ...this.pagination_merge };
                this.showModel.gridData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_merge = pagination;
                this.loadingTable_merge = false;
            },
            // 拆卷
            async mergeCase(case_id){
               this.submiteDataInfo.reduce_case_id = case_id;
               let resultData = await this.$api.dismantleCase(this.submiteDataInfo)
               if(resultData && resultData.code == '0') this.$message.success('操作成功')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .caseHandling{
        margin: 20px;
        .head-tab{
            margin-top: 30px;
            .table-dataList{
                .highlight-btn{
                    font-size: 14px;
                }
                .highlight-btn{
                    border: none;
                    color: #ffffff;
                    background-color: #6cb5ff;
                }
                .ash-btn{
                    // background-color: #d1d1d1;
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
        .addInput{
            width: 100%;
        }
        .checkboxSelect{
            padding: 15px 0 0 10%;;
        }
    }
</style>
