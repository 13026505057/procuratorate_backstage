<template>
    <div class="matchingHistoryPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" @exportExcelFun="openExportExcelFun" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%" v-loading="tableLoading">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
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
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { exportExcelFun } from '@/utils/auth'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['stock_status','base_url'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableLoading: false,
                addSearch: [
                    { dom: 'exhibit_old_tysah', value: '',placeholder: '请输入旧统一受案号', itemId: 8, name: 'input' },
                    { dom: 'exhibit_old_bmsah', value: '',placeholder: '请输入旧部门受案号', itemId: 5, name: 'input' },
                    { dom: 'exhibit_old_case_name', value: '',placeholder: '请输入旧案件名称', itemId: 10, name: 'input' },
                    { dom: 'exhibit_new_tysah', value: '',placeholder: '请输入新统一受案号', itemId: 7, name: 'input' },
                    { dom: 'exhibit_new_bmsah', value: '',placeholder: '请输入新部门受案号', itemId: 4, name: 'input' },
                    { dom: 'exhibit_new_case_name', value: '',placeholder: '请输入新案件名称', itemId: 9, name: 'input' },
                    { dom: 'exhibit_name', value: '',placeholder: '请输入卷宗名称', itemId: 6, name: 'input' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '请输入条形码号', itemId: 11, name: 'input' },
                    // { dom: 'nd', value: '',placeholder: '请选择年度', itemId: 7, name: 'dataPicker' },
                    // { dom: 'exhibit_type', value: '',placeholder: '请选择类型', itemId: 8, name: 'select' },
                ],
                selectOption: {
                    exhibit_type: []
                },
                showModel: {
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'exhibit_old_tysah', dataIndex: '旧统一受案号', itemId: 7 },
                    { title: 'exhibit_old_bmsah', dataIndex: '旧部门受案号', itemId: 2 },
                    { title: 'exhibit_old_case_name', dataIndex: '旧案件名称', itemId: 5 },
                    { title: 'exhibit_new_tysah', dataIndex: '新统一受案号', itemId: 9 },
                    { title: 'exhibit_new_bmsah', dataIndex: '新部门受案号', itemId: 10 },
                    { title: 'exhibit_new_case_name', dataIndex: '新案件名称', itemId: 6 },
                    { title: 'exhibit_name', dataIndex: '卷宗名称', itemId: 1 },
                    { title: 'dh', dataIndex: '档号', itemId: 8 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 11 },
                    { title: 'operate_user_name', dataIndex: '操作人', itemId: 3 },
                    { title: 'operate_time', dataIndex: '操作时间', itemId: 4 },
                ],
            }
           
        },
        mounted(){
            this.selectOption.exhibit_type = this.stock_status;
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
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.getExhibitLogsByPage(dataInfo);
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
            // 导出
            openExportExcelFun(data){
                this.$nextTick(()=>{
                    // window.open(this.base_url+'/?'+exportExcelFun(data))
                })
            },
        },
    }
</script>
<style lang="scss">
    .matchingHistoryPage{
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
