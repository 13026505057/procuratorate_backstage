<template>
    <div class="checkedItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'case'" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="pagination.total" v-if="pagination.total == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList">
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :prop="item.prop" :label="item.label" :show-overflow-tooltip="item.overflow"
                                v-for="item in tableItems" :key="item.tableId" align="center">
                                <template slot-scope="{row}">
                              
                                    <span v-if="item.tableId == 5">{{row[item.prop]==1?'超期':'未超期'}}</span>
                                    <span v-else-if="item.tableId == 4">
                                        {{row[item.prop]== 'in'?'已入库':'待入库'}}
                                    </span>
                                    <span v-else>{{row[item.prop]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="300">
                                <template slot-scope="{row}">
                                    <el-button @click='yanq(row.case_id)' class="highlight-btn" size="small">更改延期</el-button>
                                    <el-button @click="endyq(row.case_id)" class="highlight-btn" size="small">结束延期</el-button>
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
      
          <!-- 更改延期交卷 -->
        <el-dialog v-dialogDrag title="更改延期交卷" :visible.sync="yanqi">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="延期日期">
                    <el-date-picker
                        v-model="form.to_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss" 
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="延期原因">
                    <el-input type="textarea" v-model="form.yanqi_reason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="YQSubmit">确定</el-button>
                    <el-button @click="yanqi = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import DialogPagin from '@/components/DialogPagin'
    import DeleteCancel from '@/components/DeleteCancel'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search,DialogPagin,DeleteCancel },
        computed: {
            ...mapGetters(['base_url','print_id'])
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
                form:{
                    case_id:'',
                    to_time:'',
                    yanqi_reason:'',
                },
                yanqi:false,
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                   
                },
                setDynamicBtn: [],
                loadingTable: false,
                addSearch: [],
                selectOption: {},
                showModel: {
                    // activeNameTab: "yanqi",
                    tableList:[{
                        // case_type_id:'yanqi',
                        case_type_name:'延期中案件'
                    }],   // 类型
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
                    selectOption_type: [
                        { type_value: 'normal', type_name: '通过', type_id: 1 },
                        { type_value: 'disagree', type_name: '审核不通过', type_id: 2 },
                        { type_value: 'flaw', type_name: '不成卷(瑕疵卷)', type_id: 3 },
                        { type_value: 'datas', type_name: '资料', type_id: 4 },
                    ],
                },
                // table表头
                tableItems:[
                    {label: "统一受案号", prop: "case_bh", tableId:1},
                    {label: "部门受案号", prop: "bmsah", tableId:9},
                    {label: "案件名称", prop: "case_name", tableId:2},
                    {label: "案件类型", prop: "case_type_name", tableId:3},
                    {label: "案件描述", prop: "case_desc", overflow: true, tableId:6},                  
                    {label: "案件状态", prop: "stock_status", tableId:4},
                    {label: "评查是否超期", prop: "anguan_pingcha_chaoqi", tableId:5},                                   
                    {label: "承办人", prop: "case_take_user_name", tableId:8},       
                    {label: "延期人", prop: "yanqi_user_name", tableId:11}, 
                    {label: "延期时间", prop: "yanqi_time", tableId:11}, 

                ],
                submitDataInfoType: '',
                submitDataInfoCaseId: '',
                submitDataInfo: {
                    mark: '',
                },
            }
           
        },
        mounted(){
             this.getTableList(this.pagination);
            this.getjb()
        },
        methods: {
            //结束延期
            endyq(caseid){
                this.$api.endyanqi(caseid).then(res=>{
                    if(res.code == 0){
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                         this.getTableList(this.pagination);
                    }
                })
            },
            //延期按钮
            yanq(caseid){
                this.yanqi = true;
                this.form.case_id = caseid
            },
            YQSubmit(){
               this.$api.yanqitime(this.form).then(res=>{
                   if(res.code == 0){
                        this.$message({
                            message: '更改延期成功',
                            type: 'success'
                        });
                        this.yanqi = false;
                        this.getTableList(this.pagination);
                   }
               }).catch(error=>{
                        this.$message({
                            message: '请重新尝试',
                            type: 'warning'
                        })
               })
            },
            //延期案件角标
            getjb(){
                this.$api.yanqijb().then(res=>{
                    console.log('角标')
                    console.log(res)
                })
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
            // // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.yanqilist(dataInfo);
                if(resultData && resultData.code == '0'){
                    const pagination = { ...this.pagination };
                    this.showModel.tableData = resultData.data.list;
                    console.log(this.showModel.tableData)
                      pagination.total = resultData.data.total;
                    this.pagination = pagination;
                    this.loadingTable = false;
                }
                
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getTableList(this.pagination);
                // this.getCaseType()
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFun": "openExportExcelFun"
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            // 导出
            openExportExcelFun(data){
                // console.log(data)
                this.$nextTick(()=>{
                    
                    window.open(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
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
            // 作废
            deleteCancel(exhibit_id){
                this.$refs.deleteCancel.openDeleteDialog(exhibit_id)
            },
            //重置表单
            resetSubmitInfo(){
                for( let key in this.submitDataInfo){ this.submitDataInfo[key] = '' }
                this.showModel.dialogReceivedVisible = false;
                this.submitDataInfoType = '';
            },
            // 确认提交
            confirmBtn(case_ids){
                const typeFun = [
                    { type: 'normal', fun: 'agreeCheckFun' },
                    { type: 'disagree', fun: 'disagreeCheckFun' },
                    { type: 'flaw', fun: 'agreeCheckFun' },
                    { type: 'datas', fun: 'agreeCheckFun' },
                ]
                typeFun.map(item=>{
                    if(this.submitDataInfoType == item.type) {
                        this[item.fun](case_ids,item.type);
                        this.resetSubmitInfo();
                    }
                })
            },
            // 审查通过(普通卷/瑕疵卷/资料)
            async agreeCheckFun(case_ids,type_status){
                let resultData = await this.$api.confirmNone({case_ids,type_status})
                if(resultData && resultData.code=='0') this.$message.success('操作成功')
                this.getTableList(this.pagination)
            },
            // 审查不通过
            async disagreeCheckFun(case_ids){
                const dataInfo = { case_ids,mark: this.submitDataInfo.mark }
                let resultData = await this.$api.refuseConfirmNone(dataInfo)
                if(resultData && resultData.code=='0') this.$message.success('操作成功')
                this.getTableList(this.pagination)
            },
        },
    }
</script>
<style lang="scss">
    .checkedItemPage{
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
    }
</style>
