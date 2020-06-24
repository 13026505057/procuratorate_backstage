<template>
    <div class="notBindCheckPage">
        <div class="bindCheckBox binf_left">
            <ExportSearch :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @exportDataInfo="exportDataInfo_left"
                @comfirmSearch="comfirmSearch_left" @receivedAddress="receivedAddress_left"/>
            <div class="head-tab">
                <div class="table-dataList" >
                    <el-table :data="showModel_left.tableData" border style="width: 100%">
                        <el-table-column align="center" type="index"></el-table-column>
                        <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                            v-for="item in columns_left" :key="item.itemId" align="center">
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
                        @current-change="handleCurrentChange_left" :current-page.sync="pagination_left.pageNum"
                        :page-size="pagination_left.pageSize" layout="prev, pager, next, jumper"
                        :total="pagination_left.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="bindCheckBox">
            <ExportSearch :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @exportDataInfo="exportDataInfo_right"
                @comfirmSearch="comfirmSearch_right" @receivedAddress="receivedAddress_right"/>
            <div class="head-tab">
                <div class="table-dataList" >
                    <el-table :data="showModel_right.tableData" border style="width: 100%">
                        <el-table-column align="center" type="index"></el-table-column>
                        <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                            v-for="item in columns_right" :key="item.itemId" align="center">
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
                        @current-change="handleCurrentChange_right" :current-page.sync="pagination_right.pageNum"
                        :page-size="pagination_right.pageSize" layout="prev, pager, next, jumper"
                        :total="pagination_right.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ExportSearch from '@/components/Search/exportSearch'
    import { mapGetters } from 'vuex'
    export default {
        components: { ExportSearch },
        computed :{
            ...mapGetters(['stock_status','base_url'])
        },
        data()  {
            return  {
                addSearch: [],
                selectOption: {},

                pagination_left: {
                    pageNum: 1,
                    pageSize: 10,
                    timeYear: '',
                },
                showModel_left: {
                    tableData:[],   // 数据信息
                },
                // table表头
                columns_left: [
                    { title: 'dh', dataIndex: '档号', itemId: 1 },
                    { title: 'jh', dataIndex: '卷号', itemId: 10 },
                    { title: 'exhibit_name', dataIndex: '卷宗名称', itemId: 2 },
                    { title: 'bgr', dataIndex: '被告人', itemId: 8 },
                    { title: 'ssr', dataIndex: '申诉人', itemId: 11 },
                    { title: 'gdbm', dataIndex: '归档部门', itemId: 4 },
                    { title: 'cbr', dataIndex: '承办人', itemId: 3 },
                ],
                pagination_right: {
                    pageNum: 1,
                    pageSize: 10,
                    timeYear: '',
                },
                showModel_right: {
                    tableData:[],   // 数据信息
                },
                // table表头
                columns_right: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 10 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 2 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 8 },
                    { title: 'dept_name', dataIndex: '承办部门', itemId: 11 },
                    { title: 'bjrq', dataIndex: '办结日期', itemId: 4 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 3 },
                ],
            }
           
        },
        mounted(){
            this.getTableList_left(this.pagination_left);
            this.getTableList_right(this.pagination_right);
        },
        methods: {
            // Left
            receivedAddress_left(data){
                Object.keys(data).map(item=> this.pagination_left[item] = data[item] )
            },
            // 分页
            handleCurrentChange_left(val) {
                this.pagination_left['pageNum'] = val;
                this.getTableList_left(this.pagination_left)
            },
            // 获取案件列表
            async getTableList_left(dataInfo){
                const resultData = await this.$api.historyExhibitList(dataInfo);
                const pagination = { ...this.pagination_left };
                this.showModel_left.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_left = pagination;
            },
            // 确认搜索
            comfirmSearch_left(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_left[key] = data[key] }  })
                this.getTableList_left(this.pagination_left)
            },
            exportDataInfo_left(data){
                this.$nextTick(()=>{ 
                    for(let key in data){ this.pagination_left[key] = data[key] }
                    window.open(this.base_url+'/exhibit/exhibit/exoprtExhibits?timeYear='+this.pagination_left.timeYear+'&total_quantity=0')
                })
                
            },
            // Right
            receivedAddress_right(data){
                Object.keys(data).map(item=> this.pagination_right[item] = data[item] )
            },
            // 分页
            handleCurrentChange_right(val) {
                this.pagination_right['pageNum'] = val;
                this.getTableList_right(this.pagination_right)
            },
            // 获取案件列表
            async getTableList_right(dataInfo){
                const resultData = await this.$api.getCasesByPage(dataInfo);
                const pagination = { ...this.pagination_right };
                this.showModel_right.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination_right = pagination;
            },
            // 确认搜索
            comfirmSearch_right(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_right[key] = data[key] }  })
                this.getTableList_right(this.pagination_right)
            },
            exportDataInfo_right(data){
                this.$nextTick(()=>{ 
                    for(let key in data){ this.pagination_right[key] = data[key] }
                    window.open(this.base_url+'/cases/cases/exportCases?timeYear='+this.pagination_right.timeYear+'&case_id=NULL')
                })
                
            },
        },
    }
</script>
<style lang="scss">
    .notBindCheckPage{
        display: inline-flex;
        width: 100%;
        .bindCheckBox{
            width: 50%;
            padding: 10px;
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
        .checkboxSelect{
            padding: 15px 0 0 10%;;
        }
    }
</style>
