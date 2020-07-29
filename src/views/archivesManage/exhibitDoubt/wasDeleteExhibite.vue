<template>
    <div class="wasDeleteExhibitePage">
        <Search style="margin-top:10px;" :addSearch="addSearch" :selectOption="selectOption" :resetData="true" 
            @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress" />
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab"  v-loading="tableLoading">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="pagination.total" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table :data="showModel.tableData" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                    <template slot-scope="{row}">
                                        <span v-if="item.itemId == 11">{{ row[item.title] == 'yes'?'已使用':'未使用' }}</span>
                                        <span v-else-if="item.itemId == 8">{{ row[item.title] == 'yrk'?'是':'否' }}</span>
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
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import DialogPagin from '@/components/DialogPagin'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search,DialogPagin },
        computed :{
            ...mapGetters(['base_url'])
        },
        filters:{
            mapStatus(status){
                const statusList = {
                    SS:"诉讼",
                    JS:"技术",
                    WS:"文书",
                }
                return statusList[status]
            }
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableLoading:false,
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 5, name: 'input' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '请输入条形码号', itemId: 11, name: 'input' },
                    { dom: 'exhibit_name', value: '',placeholder: '请输入案卷名称', itemId: 6, name: 'input' },
                    { dom: 'cbr', value: '',placeholder: '请输入承办人', itemId: 9, name: 'input' },
                    { dom: 'bgr', value: '',placeholder: '请输入嫌疑人', itemId: 10, name: 'input' },
                ],
                setDynamicBtn: [],
                selectOption: {},
                showModel: {
                    activeNameTab: "wasDelete",
                    tableList:[{
                        case_type_id:'wasDelete',
                        case_type_name:'已作废案卷',
                    }],   // 类型
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 7 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 1 },
                    { title: 'deal_status', dataIndex: '是否预入库', itemId: 8 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 4 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'have_new', dataIndex: '档号是否使用', itemId: 11 },
                    { title: 'jh', dataIndex: '卷号', itemId: 3 },
                    { title: 'create_user_name', dataIndex: '作废人', itemId: 6 },
                    { title: 'create_time', dataIndex: '作废时间', itemId: 5 },
                    { title: 'zuofei_reason', dataIndex: '作废原因', itemId: 12 },
                ],
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
            // 获取案件列表
            async getTableList(dataInfo){
                this.tableLoading = true;
                this.showModel.dialogTableVisible = false;
                const resultData = await this.$api.exhibitZuofeiLogGetByPage(dataInfo);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
                this.tableLoading = false;
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getTableList(this.pagination)
            },
        },
    }
</script>
<style lang="scss">
    .wasDeleteExhibitePage{
        margin: 20px;
        .scan-table{
            margin-top: -20px;
            width: 100%;
            height: 60px;
            line-height: 60px;
            border:1px solid #6db4ff;
            background-color: #eaf5ff;
            display: flex;
            .scan-select{
                display: flex;
                align-items: center;
                margin-top: 2px;
            }
            .scan-input{
                width: 250px;
                margin-left: 20px;
            }
            .head-text{
                margin-left: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-size: 14px;
            }
        }
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
