<template>
    <div class="readyItemPage">
        <ReadyItemCase  :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" @receivedAddress="receivedAddress"/>
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%">
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
        </div>
    </div>
</template>
<script>
    import ReadyItemCase from '@/components/Search/readyItemCase'
    import { mapGetters } from 'vuex'
    export default {
        components: { ReadyItemCase },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','case_type'])
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
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一涉案号', itemId: 1, name: 'input' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '请扫描案卷条码', itemId: 2, name: 'input' },
                    { dom: 'exhibit_name', value: '',placeholder: '请输入案件名', itemId: 3, name: 'input' },
                    { dom: 'case_type_id', value: '',placeholder: '请选择类型', itemId: 4, name: 'select' },
                ],
                selectOption: {
                    case_type_id: []
                },
                showModel: {
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一涉案号', itemId: 1 },
                    { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
                    { title: 'dh', dataIndex: '档号', itemId: 2 },
                    { title: 'jh', dataIndex: '卷号', itemId: 8 },
                    { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 11 },
                    { title: 'cell_name', dataIndex: '存储位置', itemId: 3 },
                    { title: 'nd', dataIndex: '年度', itemId: 5 },
                    { title: 'stock_status', dataIndex: '入库状态', itemId: 6 },
                    { title: 'case_type_name', dataIndex: '隶属案件类型', itemId: 7 },
                ],
            }
        },
        mounted(){
            this.selectOption.case_type_id = this.case_type
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
                this.loading = true;
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                let getData = { ...dataInfo }
                const resultData = await this.$api.yrExhibitGetByPage(getData);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
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
    }
</style>
