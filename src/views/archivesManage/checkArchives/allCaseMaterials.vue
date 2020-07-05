<template>
    <div class="uncompletedPutPage">
        
        <Search style="margin-top:10px;" :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab"  v-loading="tableLoading">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="tableLoading">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 12">{{ row[item.title] | mapStatus }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column><el-table-column align="center" label="操作">
                                <template slot-scope="props">
                                    <el-button @click="reprintCodeClick(props.row)" class="highlight-btn" size="small">补打条码</el-button>
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
                            :total="showModel.tableList[0].contNum">
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
        computed: {
            ...mapGetters(['base_url','print_id'])
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
                    case_name: '',
                    tysah: '',
                    begin_time: '',
                    end_time: '',
                    print_id: '',
                    //stock_log_type: 'init',
                },
                tableLoading:false,
                exhibit_type:'SS',
                addSearch: [
                    { dom: 'tysah', value: '',placeholder: '请输入统一受案号', itemId: 5, name: 'input' },
                    { dom: 'case_name', value: '',placeholder: '请输入案件名称', itemId: 6, name: 'input' },
                    // { dom: 'timeData', value: '',placeholder: '', itemId: 7, name: 'daterange' },
                    { dom: 'out_exhibit_id', value: '',placeholder: '扫描条形码', itemId: 8, name: 'input' },
                    { dom: 'cbr', value: '',placeholder: '承办人', itemId: 9, name: 'input' },
                    { dom: 'bgr', value: '',placeholder: '嫌疑人', itemId: 10, name: 'input' },
                    { dom: 'stock_status', value: '',placeholder: '是否交卷', itemId: 11, name: 'select' },
                ],
                selectOption: {
                    stock_status: [
                        { value: 'none', label: '未入库' },
                        { value: 'in', label: '已入库' },
                    ],
                },
                showModel: {
                    activeNameTab: "inHistory",
                    tableList:[{
                        case_type_id:'inHistory',
                        case_type_name:'全部卷宗',
                        contNum: 0
                    }],   // 类型
                    tableData:[],   // 数据信息
                    // 案卷详情
                    dialogTableVisible: false,
                    gridData: [],
                    gridData_temporary: [],
                },
                // table表头
                columns: [
                    { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
                    { title: 'bmsah', dataIndex: '部门受案号', itemId: 2 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 3 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 4 },
                    { title: 'cbr', dataIndex: '承办人', itemId: 5 },
                    { title: 'bgr', dataIndex: '嫌疑人', itemId: 6 },
                    { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 12 },
                    { title: 'dh', dataIndex: '档号', overflow: false, itemId: 7 },
                    { title: 'jh', dataIndex: '卷号', overflow: true, itemId: 8 },
                    { title: 'nd', dataIndex: '年度', overflow: true, itemId: 9 },
                    { title: 'cell_name', dataIndex: '存放位置', itemId: 10 },
                    // { title: 'stock_user_name', dataIndex: '操作人', itemId: 11 },
                ],
                tableLoading:false,
            }
           
        },
        mounted(){
            // this.pagination.print_id = this.print_id
            this.getExhibitList(this.pagination);
        },
        methods: {
            // print_id没有传
            //查询卷宗
            async getExhibitList(dataInfo){
                this.tableLoading = true;
                const resultData = await this.$api.getExhibit(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.showModel.tableData = resultData.data.list;
                    this.showModel.tableList[0].contNum = resultData.data.total;
                    this.tableLoading = false;
                }
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.pagination[item] = data[item] )
            },
            // 补打条码
            async reprintCodeClick(res){
                const sendData = {};
                sendData ['exhibit_id'] = res.exhibit_id;
                sendData ['print_id'] = this.print_id;
                const resultData = await this.$api.printAgain(sendData);
                if(resultData && resultData.code == '0') {
                    this.$message.success('已发送打印请求');
                }
            },
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getExhibitList(this.pagination)
            },
           
            // 确认搜索
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
                this.getExhibitList(this.pagination)
            },
        },
    }
</script>
<style lang="scss">
    .uncompletedPutPage{
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
    }
    
</style>
