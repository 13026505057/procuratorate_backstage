<template>
    <div class="bindReadyItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                        v-for="item in columns" :key="item.itemId" align="center">
                        <template slot-scope="{row}">
                            <span v-if="item.itemId == 6">{{ row[item.title]=='none'?'未入库':'已入库' }}</span>
                            <span v-else>{{ row[item.title] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="{row}">
                            <el-button @click="showDialogPanel({ tysah: row.tysah, case_name: row.case_name, case_take_user_name: row.case_take_user_name})" class="highlight-btn" size="small">绑定预入库</el-button>
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
        <!-- 案件列表 -->
        <el-dialog v-dialogDrag title="案件列表" :visible.sync="showModel.dialogTableVisible" width="70%">
            <Search :addSearch="mergeData.addSearch" :selectOption="mergeData.selectOption" :resetData="true" 
                @comfirmSearch="comfirmSearch_merge" :hiddenAdress="false"/>
            <el-table :data="showModel.gridData" align="center" v-loading="loadingTable_merge">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex" :prop="item.title" :show-overflow-tooltip="item.overflow"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 5">{{ row[item.title]=='0'?'未交卷':'已交卷' }}</span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="{row}">
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">并卷</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination small background
                style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                @current-change="handleCurrentChange" :current-page.sync="pagination_merge.pageNum"
                :page-size="pagination_merge.pageSize" layout="prev, pager, next, jumper"
                :total="pagination_merge.total">
            </el-pagination>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg'])
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
                    case_none_status: '',
                    case_type_id: '',
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'case_none_status', value: '',placeholder: '是否已交卷', itemId: 6, name: 'select' },
                ],
                selectOption: {
                    case_none_status: [
                        { value: 1, label: '未交卷' },
                        { value: 2, label: '已交卷(未上架)' },
                    ]
                },
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                    // 案件列表
                    dialogTableVisible: false,
                    gridData: [],
                    gridData_columns: [
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
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 8 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 11 },
                    { title: 'cell_name', dataIndex: '存储位置', itemId: 3 },
                    { title: 'nd', dataIndex: '年度', itemId: 5 },
                    { title: 'stock_status', dataIndex: '入库状态', itemId: 6 },
                    { title: 'case_type_name', dataIndex: '隶属案件类型', itemId: 7 },
                ],
                mergeData: {
                    addSearch: [
                        { dom: 'tysah', value: '',placeholder: '统一受案号', itemId: 1, name: 'input' },
                        { dom: 'case_name', value: '',placeholder: '案件名称', itemId: 2, name: 'input' },
                        { dom: 'case_take_user_name', value: '',placeholder: '承办人', itemId: 3, name: 'input' },
                        // { dom: 'case_zm', value: '',placeholder: '', itemId: 4, name: 'select' },
                    ],
                    selectOption: {},
                },
                loadingTable_merge: false,
                pagination_merge: {
                    pageNum: 1,
                    pageSize: 10,
                    tysah: '',
                    case_name: '',
                    case_take_user_name: ''
                },
            }
        },
        mounted(){
            this.getTableList(this.pagination)
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
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false; 
                const resultData = await this.$api.yrExhibitGetByPage(dataInfo);
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
            // 确认搜索
            comfirmSearch_merge(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_merge[key] = data[key] } })
                this.getWasInHouseList(this.pagination_merge)
            },
            showDialogPanel(dataInfo){
                this.showModel.dialogTableVisible = true;
                ['tysah','case_name','case_take_user_name'].map((item,index)=>{
                    this.mergeData.addSearch[index].value = dataInfo[item];
                    this.pagination_merge[item] = dataInfo[item];
                })
                this.getWasInHouseList(this.pagination_merge)
            },
            // 获取已入库案件信息
            async getWasInHouseList(dataInfo){
                this.loadingTable_merge = true;
                const resultData = await this.$api.getDangAnWeiGui(dataInfo);
                const pagination = { ...this.pagination_merge };
                this.showModel.gridData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_merge = pagination;
                this.loadingTable_merge = false;
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
