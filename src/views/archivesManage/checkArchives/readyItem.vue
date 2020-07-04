<template>
    <div class="readyItemPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
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
                            <el-table-column :label="item.dataIndex"
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
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 接收案卷 -->
        <el-dialog v-dialogDrag title="新增案卷" :visible.sync="showModel.dialogReceivedVisible">
            <div v-for="(item,index) in eachDataInfoList" :key="index" style="display:table;width: 100%;margin-bottom: 10px">
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
            </div>
            <div class="checkboxSelect">
                <el-checkbox v-model="submitDataInfo.print_code">同时打印案件条形码</el-checkbox>
                <el-checkbox v-model="submitDataInfo.print_accept">同时打印收卷回执单</el-checkbox>
            </div>
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
            ...mapGetters(['exhibit_type','exhibit_time_bg','case_type','temporary_nd'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    tysah: '',
                    out_exhibit_id: '',
                    exhibit_name: '',
                    case_type_id: '',
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 1, name: 'input' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '请扫描案卷条码', itemId: 2, name: 'input' },
                    { dom: 'exhibit_name', value: '',placeholder: '请输入案件名', itemId: 3, name: 'input' },
                    { dom: 'case_type_id', value: '',placeholder: '请选择类型', itemId: 4, name: 'select' },
                ],
                selectOption: {
                    case_type_id: []
                },
                showModel: {
                    activeNameTab: "0",
                    tableList:[
                        { case_type_id: '0', case_type_name: '案件预入库' }
                    ],
                    tableData:[],   // 数据信息
                    // 新增案件
                    dialogReceivedVisible: false,
                    exhibit_type: [],
                    bgqx: [],
                    case_type_id: []
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
                setDynamicBtn: [
                    { title: '新增案卷', fun: 'addCaseItem' }
                ],
                submitDataInfo: {
                    case_id: '',
                    nd: '',
                    exhibit_type: '',
                    bgqx: '',
                    dh: '',
                    jh: '',
                    bgr: '',
                    print_code: 0,
                    print_accept: 0
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
            this.selectOption.case_type_id = this.case_type
            this.getTableList(this.pagination);
            this.getTypeList();
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            setDynamicBtnFun(data){
                const statusMap = {
                    "addCaseItem": "addCaseItem"
                }
                this[statusMap[data.fun]]()
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.yrExhibitGetByPage(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.loadingTable = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getTableList(this.pagination)
            },
            async addCaseItem(){
                this.resetSubmitInfo();
                this.showModel.dialogReceivedVisible = true;
            },
            async confirmAddCase(){
                let resultData = await this.$api.yrExhibitAdd(this.submitDataInfo)
                console.log('dsafaafsddfds')
                if(resultData && resultData.code =='0') {
                    this.resetSubmitInfo();
                    this.showModel.dialogReceivedVisible = false;
                    this.$message.success('操作成功')
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
            //重置表单
            resetSubmitInfo(){
                for( let key in this.submitDataInfo){ this.submitDataInfo[key] = '' }
                this.submitDataInfo.nd = this.temporary_nd || new Date().getFullYear();
                this.submitDataInfo.exhibit_type = this.showModel.exhibit_type[0].value;
                this.submitDataInfo.bgqx = this.showModel.bgqx[0].value;
            },
        },
    }
</script>
<style lang="scss">
    .readyItemPage{
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
