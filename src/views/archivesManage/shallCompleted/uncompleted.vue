<template>
    <div class="uncompletedShallPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
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
                                    <span v-if="item.itemId == 4">{{ row[item.title]=='0'?'未交卷':'' }}{{ row[item.title]=='1'?'已交卷':'' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="{row}">
                                    <el-button @click="showDialogPanel(row.exhibits)" class="highlight-btn" size="small">已有案卷</el-button>
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
        <el-dialog v-dialogDrag title="案卷详情" :visible.sync="showModel.dialogTableVisible" width="70%">
            <el-table :data="showModel.gridData" align="center">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 6">{{ row[item.title]=='in'?'已入库':'' }}{{ row[item.title]=='none'?'待入库':'' }}</span>
                        <span v-else-if="item.itemId == 7">{{ row[item.title]=='0'?'失效':'有效' }}</span>
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
            <DialogPagin ref="dialogTablePagin" :tableData="showModel.gridData_temporary" @dialogTablePagin="dialogTablePagin"/>
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
            ...mapGetters(['base_url','org_id','print_id'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_name: '',
                    case_zm: '',
                    case_bh: '',
                    timeYear: '',
                    case_take_user_name: '',
                    dangan_accept_status: '',
                    case_type_id: '',
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'dangan_accept_status', value: '',placeholder: '是否已交卷', itemId: 6, name: 'select' },
                ],
                setDynamicBtn: [
                    { title: '导出', fun: 'exprotFun' }
                ],
                selectOption: {
                    dangan_accept_status: [
                        { value: 0, label: '未交卷' },
                        { value: 1, label: '已交卷(未上架)' },
                    ]
                },
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
                    ]
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', overflow: false, itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', overflow: false, itemId: 7 },
                    { title: 'case_name', dataIndex: '案件名称', overflow: false, itemId: 10 },
                    { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                    { title: 'case_type_name', dataIndex: '案件类型', overflow: false, itemId: 2 },
                    { title: 'case_take_user_name', dataIndex: '承办人', overflow: false, itemId: 3 },
                    { title: 'dangan_accept_status', dataIndex: '是否交卷', overflow: false, itemId: 4 },
                    { title: 'dangan_accept_time', dataIndex: '交卷日期', overflow: false, itemId: 5 },
                    { title: 'dangan_accept_day', dataIndex: '交卷天数', overflow: false, itemId: 6 },
                ],
            }
        },
        mounted(){
            this.getCaseType();
        },
        methods: {
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFun": "exprotUncompleteData"
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            exprotUncompleteData(data){
                this.$nextTick(()=>{
                    window.open(this.base_url+'/cases/cases/exportYingGuiWeiGuiCases?case_name='+data.case_name+'&case_bh='+data.case_bh+'&timeYear='+data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&dangan_accept_status='+data.dangan_accept_status+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
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
            handleClickTab(e){
                this.pagination.case_type_id = e.paneName
                this.getTableList(this.pagination)
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
                    dataInfo.cout_for = 'getDangAnWeiGui';

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
            // 获取未归档案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                const resultData = await this.$api.getDangAnWeiGui(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getCaseType(this.pagination)
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
                let resultData = await this.$api.printAcceptReturn({exhibit_id})
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 作废
            deleteCancel(exhibit_id){
                this.$refs.deleteCancel.openDeleteDialog(exhibit_id)
            },
        },
    }
</script>
<style lang="scss">
    .uncompletedShallPage{
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
    }
    
</style>
