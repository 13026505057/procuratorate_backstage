<template>
    <div class="bindReadyItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'exhibit'" :hiddenAdress="true"
            @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
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
                                    <span v-if="item.itemId == 6">{{ row[item.title]=='none'?'未入库':'' }}{{ row[item.title]=='in'?'已入库':'' }}</span>
                                    <span v-else-if="item.itemId == 14">{{ row[item.title]=='SS'?'诉讼':'' }}{{ row[item.title]=='WS'?'文书':'' }}{{ row[item.title]=='JS'?'技术':'' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="200">
                                <template slot-scope="{row}">
                                    <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                                    <el-button @click="showDialogPanel({ tysah: row.tysah, case_name: row.exhibit_name, cbr: row.cbr, bgr:row.bgr },row.exhibit_id)" class="highlight-btn" size="small">绑定案件</el-button>
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
                            <el-button @click="bindCaseDataClick_ysl(row.bmsah)" class="highlight-btn" type="operation" size="small">绑定</el-button>
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
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','org_id'])
        },
        data()  {
            return  {
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
                    ]
                },
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
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 12 },
                    { title: 'yr_cese_type_name', dataIndex: '案件类型', itemId: 16 },
                    { title: 'ay', dataIndex: '案由', itemId: 7 },
                    { title: 'bgr', dataIndex: '嫌疑人', itemId: 15 },
                    { title: 'bgqx', dataIndex: '保管期限', itemId: 13 },
                    { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 14 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 8 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 11 },
                    { title: 'cell_name', dataIndex: '存储位置', itemId: 3 },
                    { title: 'nd', dataIndex: '年度', itemId: 5 },
                    { title: 'stock_status', dataIndex: '入库状态', itemId: 6 },
                    // { title: 'case_type_name', dataIndex: '隶属案件类型', itemId: 7 },
                ],
                mergeData: {
                    addSearch: [
                        { dom: 'tysah', value: '',placeholder: '统一受案号', itemId: 1, name: 'input' },
                        { dom: 'case_name', value: '',placeholder: '案件名称', itemId: 2, name: 'input' },
                        { dom: 'cbr', value: '',placeholder: '承办人', itemId: 3, name: 'input' },
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
            this.pagination_merge_ysl.org_id = this.pagination_merge_yrk.org_id = this.org_id
            this.getTableList(this.pagination)
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> {
                    this.pagination[item] = data[item]
                    this.pagination_merge_yrk[item] = this.pagination_merge_ysl[item] = data[item]
                } )
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
            bindCaseDataClick_ysl(bmsah){
                this.bindCaseDataRequest_ysl(bmsah);
            },
            async bindCaseDataRequest_ysl(bmsah){
                let dataInfo = {
                    exhibit_id: this.bindCaseData.exhibit_id, bmsah: bmsah
                }
                let resultData = await this.$api.attachExhibitToShouliCase(dataInfo)
                if(resultData && resultData.code == '0'){
                    this.showModel.dialogTableVisible = false;
                    this.$message.success('操作成功');
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
            }
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
        .checkboxSelect{
            padding: 15px 0 0 10%;;
        }
    }
</style>
