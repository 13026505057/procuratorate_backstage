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
                            <el-table-column :prop="item.title" :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center"></el-table-column>
                            <el-table-column align="center" label="操作" width="300">
                                <template slot-scope="{row}">
                                    <el-button @click="showDialogPanel(row.exhibits)" class="highlight-btn" size="small">已有案卷</el-button>
                                    <el-button v-if="row.dangan_accept_status=='0'?true:false" @click="reciveCaseAgain(row.case_id)" class="highlight-btn" size="small">重新接收</el-button>
                                    <!-- <el-button @click="resultItem(row.case_id)" class="highlight-btn" size="small">审查结果</el-button> -->
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
        <el-dialog v-dialogDrag title="案卷详情" :visible.sync="showModel.dialogTableVisible">
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
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="{row}">
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">补打条码</el-button>
                        <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <DialogPagin ref="dialogTablePagin" :tableData="showModel.gridData_temporary" @dialogTablePagin="dialogTablePagin"/>
        </el-dialog>
        <!-- 接收案卷 -->
        <el-dialog v-dialogDrag title="档案检查" :visible.sync="showModel.dialogReceivedVisible" @close="resetSubmitInfo">
            <div style="display:table;width: 100%;margin-bottom: 10px">
                <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                    检查结果：
                </span>
                <el-select v-model="submitDataInfoType" placeholder="请选择检查结果">
                    <el-option v-for="itemChild in showModel.selectOption_type" :key="itemChild.type_item" 
                        :label="itemChild.type_name" :value="itemChild.type_value"></el-option>
                </el-select>
            </div>
            <div  style="display:table;width: 100%;margin-bottom: 10px" v-if="submitDataInfoType=='disagree'">
                <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                    退查原因：
                </span>
                <el-input v-model="submitDataInfo['mark']" clearable placeholder="请填写退查原因" style="width: auto"></el-input>
            </div>
            <!-- <div style="display:table;width: 100%;margin-bottom: 10px" v-else-if="submitDataInfoType=='flaw'">
                <span style="display:table-cell;width: 25%;text-align: right;padding-right: 20px">
                    标识原因：
                </span>
                <el-input v-model="submitDataInfo['mark']" clearable placeholder="请填写标识原因" style="width: auto"></el-input>
            </div> -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogReceivedVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn(submitDataInfoCaseId)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 作废 -->
        <DeleteCancel ref="deleteCancel" />
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
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_none_confirm:'1'
                },
                setDynamicBtn: [],
                loadingTable: false,
                addSearch: [],
                selectOption: {},
                showModel: {
                    activeNameTab: "tuicha",
                    tableList:[{
                        case_type_id:'tuicha',
                        case_type_name:'退查中案件'
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
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 2 },
                    { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    { title: 'refuse_type_name', dataIndex: '退查类型', itemId: 4 },
                    { title: 'tuicha_mark', dataIndex: '退查原因', itemId: 5 },
                    { title: 'tuicha_time', dataIndex: '退查时间', itemId: 6 },
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
        },
        methods: {
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
            // 重新接受案卷
            reciveCaseAgain(dataInfo){
                console.log(dataInfo)
                this.reciveCaseAgainRequest(dataInfo);
            },
            async reciveCaseAgainRequest(dataInfo){
                const sendData = {}
                sendData ['case_id'] =  dataInfo;
                sendData ['print_id'] =  this.print_id;
                sendData ['print_accept'] = '1';
                const resultData = await this.$api.reciveCaseAgain(sendData);
                if(resultData && resultData.code == '0'){
                    this.$message.success('操作成功')
                    this.getTableList(this.pagination)
                }
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getRefuseCase(dataInfo);
                if(resultData && resultData.code == '0'){
                    // console.log(resultData.data)
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
            // 接收案卷信息
            resultItem(case_id){
                this.showModel.dialogReceivedVisible = true;
                this.submitDataInfoCaseId = case_id
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
