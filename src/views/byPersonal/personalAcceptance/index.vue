<template>
    <div class="personalAcceptancePage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                        v-for="item in columns" :key="item.itemId" align="center">
                        <template slot-scope="{row}">
                            <span v-if="item.itemId == 4">{{ row[item.title] | mapStatus }}</span>
                            <span v-else-if="item.itemId == 8">{{ row[item.title]=='1'?'评查中':'待入库' }}</span>
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
    import Search from '@/components/Search/index'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed :{
            ...mapGetters(['exhibit_type','exhibit_time_bg','base_url'])
        },
        filters: {
            mapStatus(status){
                const statusMap = {
                    "in": "已归档",
                    "in_jj_out": "已归档（交卷超期）",
                    "in_rk_out": "已归档（入库超期）",
                    "in_all_out": "已归档（双超期）",
                    "none": "未归档",
                    "none_jj_out": "未归档（交卷超期）",
                    "none_rk_out": "未归档（入库超期）",
                    "none_all_out": "未归档（双超期）",
                }
                return statusMap[status]
            }
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
                    case_type_id: '',
                },
                setDynamicBtn: [
                    { title: '导出', fun: 'exprotFun' }
                ],
                loadingTable: false,
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                selectOption: {},
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '案件编号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 12 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    { title: 'ajlb_mc', dataIndex: '案件类型', itemId: 13 },
                    { title: 'case_none_status', dataIndex: '案件状态', itemId: 8 },
                    { title: 'case_desc', dataIndex: '案件描述', overflow: true, itemId: 11 },
                    { title: 'slrq', dataIndex: '受理日期', itemId: 4 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    { title: 'total_quantity', dataIndex: '总案卷数', itemId: 5 },
                    { title: 'in_quantity', dataIndex: '在库案卷数', itemId: 6 },
                    { title: 'wait_quantity', dataIndex: '待入库案卷数', itemId: 7 },
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
                this.loadingTable = true;
                const resultData = await this.$api.casesShouliGetByPage(dataInfo);
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
                // console.log(data)
                this.$nextTick(()=>{
                    console.log(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
                    // window.open(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        // '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        // '&city_id='+data.city_id+ '&area_id='+data.area_id)
                })
            },
        },
    }
</script>
<style lang="scss">
    .personalAcceptancePage{
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
