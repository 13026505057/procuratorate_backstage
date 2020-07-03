<template>
    <div class="finishStatusPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
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
        <!-- 新增查询 -->
        <el-dialog v-dialogDrag title="新增查询" :visible.sync="showModel.dialogTableVisible" @close="resetSubmitInfo">
            <div class="addCaseBox_container">
                <div class="addCaseBox_item">
                    <div v-for="(item,index) in eachDataInfoList.slice(0,6)" :key="index" class="item">
                        <span> {{ item.captionTitle }}：</span>
                        <el-input v-model="submitDataInfo[item.dom]" v-if="item.type=='input'"
                            :placeholder="item.placeholder" style="width: auto"></el-input>
                        <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="addCaseBox_item">
                    <div v-for="(item,index) in eachDataInfoList.slice(6,11)" :key="index" class="item">
                        <span> {{ item.captionTitle }}：</span>
                        <el-input v-model="submitDataInfo[item.dom]" v-if="item.type=='input'"
                            :placeholder="item.placeholder" style="width: auto"></el-input>
                        <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogAddCaseVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddCase">确 定</el-button>
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
            ...mapGetters(['exhibit_type','exhibit_time_bg','case_type'])
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
                ],
                selectOption: {},
                showModel: {
                    tableData:[],   // 数据信息
                    // 新增查询
                    dialogTableVisible: false,
                    exhibit_type: [],
                    bgqx: [],
                    case_type_id: []
                },
                submitDataInfo: {
                    exhibit_name: '',
                    tysah: '',
                    jh: '',
                    cbr: '',
                    bgqx: '',
                    exhibit_type: '',
                    nd: '',
                    dh: '',
                    ay: '',
                    bgr: '',
                    case_type_id: ''
                },
                eachDataInfoList: [
                    { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'exhibit_name', itemId: 1, type: 'input' },
                    { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                    { captionTitle: '卷号', placeholder: '请输入卷号', dom: 'jh', itemId: 3, type: 'input' },
                    { captionTitle: '承办人', placeholder: '请输入承办人', dom: 'cbr', itemId: 4, type: 'input' },
                    { captionTitle: '期限', placeholder: '请选择期限', dom: 'bgqx', itemId: 5, type: 'select' },
                    { captionTitle: '类型', placeholder: '请选择类型', dom: 'exhibit_type', itemId: 6, type: 'select' },

                    { captionTitle: '年度', placeholder: '请输入年度', dom: 'nd', itemId: 7, type: 'input' },
                    { captionTitle: '档号', placeholder: '请输入档号', dom: 'dh', itemId: 8, type: 'input' },
                    { captionTitle: '案由', placeholder: '请输入案由', dom: 'ay', itemId: 9, type: 'input' },
                    { captionTitle: '犯罪嫌疑人', placeholder: '请输入犯罪嫌疑人', dom: 'bgr', itemId:10, type: 'input' },
                    { captionTitle: '类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'select' },
                ],
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
                setDynamicBtn: [
                    { title: '新增查询', fun: 'addCheckItem' }
                ],
            }
        },
        mounted(){
            this.getTypeList();
            this.getTableList(this.pagination)
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCheckItem": "addCheckItem"
                }
                this[statusMap[data]]()
            },
            addCheckItem(){
                this.showModel.dialogTableVisible = true;
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            getTypeList(){
                let dataArr = [
                    { showModel: 'bgqx', store: 'exhibit_time_bg' },
                    { showModel: 'exhibit_type', store: 'exhibit_type' },
                    { showModel: 'case_type_id', store: 'case_type' },
                ]
                dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
            },
            // 获取列表
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
                this.getTableList(this.pagination)
            },
        }
    }
</script>
<style lang="scss">
    .finishStatusPage{
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
