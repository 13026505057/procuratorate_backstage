<template>
    <div class="disagreeCheckedPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
        <div class="table-dataList" >
            <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                    v-for="item in columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 4">{{ row[item.title] | mapStatus }}</span>
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
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_name: '',
                    tysah: '',
                    timeYear: '',
                },
                loadingTable: false,
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 1, name: 'input' },
                    { dom: 'case_name', value: '',placeholder: '请输入案件名', itemId: 2, name: 'input' },
                    { dom: 'timeYear', value: '',placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                ],
                selectOption: {},
                showModel: {
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', overflow: true, itemId: 11 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 4 },
                    { title: 'last_update_time', dataIndex: '退查时间', itemId: 3 },
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
            handleClickTab(e){
                this.pagination.case_type_id = e.paneName
                this.getTableList(this.pagination)
            },
            // 获取案件列表
            async getTableList(dataInfo){
                this.loadingTable = true;
                this.showModel.dialogTableVisible = false;
                const resultData = await this.$api.caseRefuseHistoryGetByPage(dataInfo);
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
        },
    }
</script>
<style lang="scss">
    .disagreeCheckedPage{
        margin: 20px;
        .table-dataList{
            margin-top: 30px;
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
