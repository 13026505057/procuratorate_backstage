<template>
    <div class="uploadAcceptancePage">
         <div style="display:flex;">
            <el-button type="primary" @click="importCaseData">导入</el-button>
            <el-button type="primary" @click="dowon">示例模板下载</el-button>
            <el-cascader ref="treeOrg" class="demonstration" placeholder="试试搜索：青岛市" :options="org_list" @change="handleChange"
             :props="{ checkStrictly: true }" filterable clearable style="margin-left:30px;margin-right:30px;width:300px" ></el-cascader>
             <el-input placeholder="请输入文件名" v-model="pagination.excel_name" clearable style="width:200px;margin-right:30px"> </el-input>
             <el-button  type="primary" @click="search">查询</el-button>
        </div> 
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                        v-for="(item,index) in columns" :key="index" align="center">
                        <template slot-scope="{row}">
                            <span >{{ row[item.title] }}</span>
                        </template>
                    </el-table-column>
                     <el-table-column align="center" label="操作">
                        <template slot-scope="{row}">
                            <el-button type="primary" @click.native="rowdetail(row)">详情</el-button>
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
        <!-- 批量导入 -->
        <el-dialog v-dialogDrag title="受理案件导入" :visible.sync="showModel.importCasePanel">
            <el-upload ref="uploadExcel" class="upload-demo" drag multiple :headers="showModel.headersUpload"
                :action="base_url + '/cases/cases/addByExcelToCaseExcel'" :on-success="uploadSuccess" 
                accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
        <!-- 详情信息 -->
        <el-dialog v-dialogDrag title="详情" :visible.sync="show"  >
                <el-table :data="detais" style="width: 100%" ref="multipleTable"  @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" :selectable='selectInit' > </el-table-column>
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column v-for="(item,index) in conts" :key="index" align="center" :label="item.dataIndex">
                        <template slot-scope="{row}">
                            {{row[item.title]}}
                        </template>
                    </el-table-column>
                    <el-table-column  align="center" label="操作">
                        <template slot-scope="{row}">
                             <el-button type="primary" @click.native="updr(row)">修改</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="Submrt">确认案件信息</el-button>
        </el-dialog>
        <!-- 导入案件修改信息 -->
        <el-dialog v-dialogDrag title="导入信息修改" :visible.sync="daoru"  >
                <el-form :model="submitDataInfo_case" :rules="rules"   ref="ruleForm" label-width="20%" class="demo-ruleForm">
                    <template v-for="(item,index) in eachDataInfoList_case" >
                        <el-form-item :label="item.captionTitle" :prop="item.dom" :key="index">
                            <el-input class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-if="item.type == 'input'"></el-input>
                            <el-input class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" type="textarea" v-else-if="item.type == 'textarea'"></el-input>
                            <!-- <el-select class="addInput" v-model="submitDataInfo_case[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'"> -->
                            <el-cascader
                                :options="showModels"
                                :props="{ checkStrictly: true }"
                                v-model="submitDataInfo_case[item.dom]"
                                clearable
                                v-else-if="item.type == 'cascader'">
                            </el-cascader>
                                <!-- <el-option v-for="(item,index) in showModels" :key="index" 
                                    :label="item.case_type_name" :value="item.case_type_id"></el-option> -->
                            <!-- </el-select> -->
                            <el-date-picker v-model="submitDataInfo_case[item.dom]" type="datetime" :placeholder="item.placeholder"  v-if="item.type == 'time'"
                                value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
                        </el-form-item>
                    </template>
                <el-form-item>
                    <el-button @click.native="daoru = false">取 消</el-button>
                    <el-button type="primary" @click.native="update('ruleForm')">确 定</el-button>
                </el-form-item>
            </el-form> 
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search/index'
    import { mapGetters } from 'vuex'
    import { getToken, exportExcelFun } from '@/utils/auth'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','base_url','org_list'])
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
                huten:false,
                case_excel_head_id:'',
                showModels:[],
                submitDataInfo_case: {
                    case_excel_line_id:'',
                    tysah: '',
                    bmsah: '',
                    case_name: '',
                    case_desc: '',
                    case_type_id: '',
                    case_type_name:'',
                    slrq:'',
                    over_time:''
                },
                eachDataInfoList_case: [
                    { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                    { captionTitle: '部门受案号', placeholder: '请输入部门受案号', dom: 'bmsah', itemId: 5, type: 'input' },
                    { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'case_name', itemId: 1, type: 'input' },
                    { captionTitle: '案件描述', placeholder: '请输入案件描述', dom: 'case_desc', itemId: 3, type: 'textarea' },
                    { captionTitle: '案件类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'cascader' },           
                    { captionTitle: '受理日期', placeholder: '请选择受理日期', dom: 'slrq', itemId: 7, type: 'time' },
                    { captionTitle: '实质办结日期', placeholder: '请选择实质办结日期', dom: 'bjrq', itemId: 8, type: 'time' },
                ],
                rules: {
                    case_name: [
                        { required: true, message: '请输入案件名称', trigger: 'blur'  }
                    ],
             
                    case_type_id: [
                        { required: true, message: '请选择案件类型', trigger: 'blur' }
                    ],
                    slrq:[
                        { required: true, message: '请选择受理日期', trigger: 'blur' }
                    ],
                    bjrq:[
                        { required: true, message: '请选择实质办结日期', trigger: 'blur' }
                    ]
                },
                daoru:false,
                options:[],
                multipleSelection:[],
                conts:[{ title: 'tysah', dataIndex: '统一受案号', itemId: 4 },
                       { title: 'bmsah', dataIndex: '部门受案号', itemId: 5 },
                       { title: 'case_desc', dataIndex: '案件描述', itemId: 6 },
                       { title: 'case_name', dataIndex: '案件名称', itemId: 1 },
                       { title: 'case_type_name', dataIndex: '案件类型', itemId: 2 },
                       { title:'slrq',dataIndex:'受理日期', itemId: 3 },
                       { title:'bjrq',dataIndex:'实质办结日期', itemId: 7 }],
                detais:[],
                show:false,
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    province_id: "370000",
                    city_id: "370200",
                    area_id: "",
                    excel_name:'',
                },
                loadingTable: false,
                addSearch: [],
                selectOption: {},
                setDynamicBtn: [
                    { title: '导入', fun: 'importCase' },
                    { title: '导出', fun: 'exprotFun' }
                ],
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                    importCasePanel: false,
                    headersUpload: { 'kf-token': getToken() }
                },
                // table表头
                columns: [
                    { title: 'excel_name', dataIndex: '文件名称', itemId: 1 },
                    { title: 'org_name', dataIndex: '所属机构', itemId: 3 },
                    { title: 'create_user_name', dataIndex: '上传人', itemId: 4 },
                    { title: 'create_time', dataIndex: '创建时间', itemId: 2 },
                   
         
                ],
            }
           
        },
        mounted(){
            this.getTableList(this.pagination);
        },
        methods: {
            updr(row){     
                this.submitDataInfo_case.tysah = row.tysah
                this.submitDataInfo_case.bmsah = row.bmsah
                this.submitDataInfo_case.case_name = row.case_name
                this.submitDataInfo_case.case_desc = row.case_desc
                this.submitDataInfo_case.case_type_id = row.case_type_id
                this.submitDataInfo_case.slrq = row.slrq
                this.submitDataInfo_case.bjrq = row.bjrq
                this.submitDataInfo_case.case_excel_line_id = row.case_excel_line_id
                this.daoru = true;
                this.$api.getcasetype(row.org_id).then(res=>{
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
            //修改导入案件
            update(formName){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.showModels.filter(item=>{
                        if(item.case_type_id = this.submitDataInfo_case.case_type_id ){
                            this.submitDataInfo_case.case_type_name =  item.case_type_name
                        }
                    })         
                    this.submitDataInfo_case.case_type_id = this.submitDataInfo_case.case_type_id.pop();
                    this.$api.updatedetal(this.submitDataInfo_case).then(res=>{
                     if(res.code == 0){
                        this.$message.success('修改成功')
                        this.daoru = false;
                        this.getTableList(this.pagination);                                
                    }    
                })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            
            },
            //查询
            search(){
             console.log('查询')
                this.getTableList(this.pagination);
            },
            handleChange(value) {  
                this.pagination.area_id = value[1]
                 console.log(this.pagination.area_id);
             
            },
            //示例模板下载
            dowon(){
                this.$api.dowonload().then(res=>{
                     window.open(res.msg);                 
                })
            },
            //确定案件信息
            Submrt(){
                let line_ids = [] 
                 this.multipleSelection.map(item=>{
                    line_ids.push(item.case_excel_line_id )
                })
                let line_id = line_ids.join(",")
                console.log('数组信息')
                console.log(line_id.length)
                if(!line_id){
                    this.$message({
                            message: '无案件确信息确认',
                            type: 'error'
                    });
                }else{
                    const dataInfo = {line_ids:line_id}
                    this.$api.subcase(dataInfo).then(res=>{
                        if(res.code == 0){
                            this.$message.success('操作成功')
                            this.show = false
                        }
                    })
                }
                
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //判断当前复选框是否可以勾选
            selectInit(row,index){
          
                if(row.case_excel_line_status == 0 || row.case_excel_line_status == null){
                    return true
                }else{
                     return false
                }
                 
            },
            //当前导入文件详情
            rowdetail(row){
               this.case_excel_head_id = row.case_excel_head_id
               this.show = true;
               this.detais = row.caseExcelLineList
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "importCase": "importCaseData"
                }
                this[statusMap[data.fun]]()
            },
            importCaseData(){
                this.showModel.importCasePanel = true;
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                const resultData = await this.$api.gethistory(dataInfo);
                const pagination = { ...this.pagination };
                let resultData_table = [];
                resultData.data.list.map(item=>{
                    resultData_table.push({excel_name: item.excel_name, create_time:item.create_time,...item})
                })
                this.showModel.tableData = resultData_table;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
                if(!this.huten){
                    resultData_table.filter(item=>{
                        if(item.case_excel_head_id == this.case_excel_head_id){
                            this.detais = item.caseExcelLineList
                        }else{
                            console.log('没过滤')
                        }
                    })
                }else{
                   this.huten = false

                }
              
            },
            uploadSuccess(response){
                if(response.code == '0') {            
                    this.$message.success('上传成功')
                    this.showModel.importCasePanel = false
                    this.detais = response.data[0].caseExcelLineList
                    this.huten  = true
                    this.getTableList(this.pagination); 
                    
                    this.show = true;
                      
             
                    
                } else {
                    this.$message.warning(response.msg)
                    this.$refs.uploadExcel.clearFiles()
                }
            },
            // 确认搜索
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFun": "openExportExcelFun"
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
        },
    }
</script>
<style lang="scss">

    .uploadAcceptancePage{
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
        .upload-demo{
            text-align: center;
        }
    }
</style>
