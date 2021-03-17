<template>
    <div class="checkedItemHistoryPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" :youxiao='true' :type="'case'" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="pagination.total" v-if="pagination.total == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList">
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :prop="item.title" :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                     <span v-if="item.itemId == 4">{{row[item.title]==1? '是':'否'}}</span>
                                     <span v-else>{{row[item.title]}}</span>
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
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed: {
            ...mapGetters(['base_url','print_id'])
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
                },
                setDynamicBtn: [],
                loadingTable: false,
                addSearch: [
                    { dom: 'case_bh', value: '', placeholder: '统一受案号', itemId: 0, name: 'input' },
                    { dom: 'bmsah', value: '', placeholder: '部门受案号', itemId: -1, name: 'input' },
                    { dom: 'case_name', value: '', placeholder: '请输入案件名称', itemId: 1, name: 'input' },
                    { dom: 'case_take_user_name', value: '', placeholder: '请输入承办人', itemId: -2, name: 'input' },
                    { dom: 'is_alive', value: '',placeholder: '是否有效', itemId: 8, name: 'is_alive' },
                    { dom: 'operate_begin_time', value: '',placeholder: '开始时间', itemId: 4, name: 'daterange_begin' },
                    { dom: 'operate_end_time', value: '',placeholder: '结束时间', itemId: -4, name: 'daterange_end' },
                ],
                selectOption: {},
                showModel: {
                    activeNameTab: "tuicha",
                    tableList:[{
                        case_type_id:'tuicha',
                        case_type_name:'延期记录'
                    }],   // 类型
                    tableData:[],   // 数据信息
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 2 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    {dataIndex: "案件类型", title: "case_type_name",  itemId:3},
                    {dataIndex: "案件描述", title: "case_desc", overflow: true,  itemId:6},    
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    { title: 'is_alive', dataIndex: '是否有效', itemId: 4 },
                    { title: 'yanqi_reason', dataIndex: '延期原因', itemId: 5 },
                    { title: 'operate_time', dataIndex: '操作时间', itemId: 6 },
                    { title: 'to_time', dataIndex: '延期时间', itemId: 7 }
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
                this.showModel.dialogTableVisible = false;
                this.showModel.dialogReceivedVisible = false;
                const resultData = await this.$api.yanqihistory(dataInfo);
                if(resultData && resultData.code == '0'){
                    const pagination = { ...this.pagination };
                    this.showModel.tableData = resultData.data.list;
                    pagination.total = resultData.data.total;
                    this.pagination = pagination;
                    this.loadingTable = false;
                }
                
            },
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getTableList(this.pagination);
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
                    window.open(this.base_url+'/?case_bh='+data.case_bh+'&case_name='+ data.case_name+'&case_zm='+ data.case_zm+
                        '&timeYear='+ data.timeYear+'&case_take_user_name='+data.case_take_user_name+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
                })
            },
        },
    }
</script>
<style lang="scss">
    .checkedItemHistoryPage{
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
