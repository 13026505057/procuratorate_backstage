<template>
    <div class="giveBackPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'case'" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="table-dataList" >
            <el-table :data="showModel.tableData" border style="width: 100%" v-loading="tableLoading">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row[item.title] }}</span>
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
</template>
<script>
    import Search from '@/components/Search'
    import { exportExcelFun } from '@/utils/auth'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed: {
            ...mapGetters(['user_id','base_url'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_none_confirm:'1',
                    user_id: ''
                },
                setDynamicBtn: [
                    { title: '导出', fun: 'exprotFun' }
                ],
                tableLoading: false,
                addSearch: [],
                selectOption: {},
                showModel: {
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: -1 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'case_type_name', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 11 },
                    { title: 'time_status', dataIndex: '案件名称', itemId: 4 },
                    { title: 'create_time', dataIndex: '退查时间', itemId: 3 },
                    { title: 'create_user_name', dataIndex: '操作人', itemId: 5 },
                    { title: 'mark', dataIndex: '退查原因', itemId: 6 },
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
            // DialogPagin
            dialogTablePagin(data){
                this.showModel.gridData = data
            },
            handleClickTab(e){
                this.pagination.case_type_id = e.paneName
                this.getTableList(this.pagination)
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.tableLoading = true;
                dataInfo.user_id = this.user_id
                const resultData = await this.$api.getRefuseCase(dataInfo);
                const pagination = { ...this.pagination };
                let resultData_table = [];
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
            setDynamicBtnFun(data){
                const statusMap = {
                    "exprotFun": "openExportExcelFun"
                }
                this[statusMap[data.fun]](data.dataInfo)
            },
            // 导出 
            openExportExcelFun(data){
                this.$nextTick(()=>{
                    // window.open(this.base_url+'/?'+exportExcelFun(data))
                })
            },
            showDialogPanel(dataInfo){
                this.showModel.dialogTableVisible = true;
                this.showModel.gridData_temporary = dataInfo
                this.$nextTick(() => {
                    this.$refs.dialogTablePagin.dialogTablePagin(1)
                })
            },
        },
    }
</script>
<style lang="scss">
    .giveBackPage{
        margin: 20px;
        .table-dataList{
            padding-top: 20px;
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
    }
    
</style>
