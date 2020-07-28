<template>
    <div class="bySelfMatchPage">
        <div class="bindCheckBox binf_left">
            <Search :addSearch="addSearch_left" :selectOption="selectOption_left" :resetData="true" @comfirmSearch="comfirmSearch_left" 
                @receivedAddress="receivedAddress_left"  @exportExcelFun="openExportExcelFun_left" :exportExcelBtn="true"
                :hiddenAdress="false"/>
            <div class="head-tab">
                <div class="table-dataList" >
                    <el-table :data="showModel_left.tableData" border style="width: 100%" ref="singleTable"
                        highlight-current-row @cell-click="selectCellItem" v-loading="dataLoading">
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
            <div class="head-tab right_top">
                <div class="table-dataList" >
                    <el-table :data="showModel_right.tableData_top" border style="width: 100%" v-loading="loading_right_top">
                        <el-table-column align="center" type="index"></el-table-column>
                        <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                            v-for="item in columns_right" :key="item.itemId" align="center">
                            <template slot-scope="{row}">
                                <span v-if="item.itemId == 5">{{ row[item.title]=='1'?'已绑定':'未绑定' }}</span>
                                <span v-else>{{ row[item.title] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="{row}">
                                <el-popconfirm title="确定绑定此案件?" @onConfirm="bindCaseForExhibit(row.case_id)">
                                    <el-button slot="reference" type="search" :disabled="row.is_old == 1">绑定</el-button>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="right_bottom">
                <Search :addSearch="addSearch_right" :selectOption="selectOption_right" :resetData="true" @comfirmSearch="comfirmSearch_right" 
                    @receivedAddress="receivedAddress_right"  @exportExcelFun="openExportExcelFun_right" :exportExcelBtn="true"
                    :hiddenAdress="false"/>
                <div class="head-tab">
                    <div class="table-dataList" >
                        <el-table :data="showModel_right.tableData_bottom" height="calc(100vh - 295px)" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                                v-for="item in columns_right" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 5">{{ row[item.title]=='1'?'已绑定':'未绑定' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="{row}">
                                    <el-popconfirm title="确定绑定此案件?" @onConfirm="bindCaseForExhibit(row.case_id)">
                                        <el-button slot="reference" type="search" :disabled="row.is_old == 1">绑定</el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
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
            ...mapGetters(['stock_status','base_url','org_id'])
        },
        data()  {
            return  {
                pagination_left: {
                    pageNum: 1,
                    pageSize: 10,
                    nd: '',
                    exhibit_name: '',
                    bgr: '',
                    out_exhibit_id: '',
                    org_id: '',
                    exhibit_status: 1
                },
                addSearch_left: [
                    { dom: 'nd', value: '', placeholder: '请选择年份', itemId: 1, name: 'dataPicker' },
                    { dom: 'exhibit_name', value: '', placeholder: '请输入案卷名称', itemId: 2, name: 'input' },
                    { dom: 'bgr', value: '', placeholder: '被告人', itemId: 3, name: 'input' },
                    { dom: 'cbr', value: '', placeholder: '承办人', itemId: 5, name: 'input' },
                    { dom: 'out_exhibit_id', value: '', placeholder: '请扫描条形码号', itemId: 4, name: 'input' },
                ],
                dataLoading:false,
                selectOption_left: {},
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
                    case_name: '',
                    case_bh: '',
                    case_take_user_name: '',
                    bmsah: '',
                    org_id: ''
                },
                loading_right_top: false,
                addSearch_right: [
                    { dom: 'tysah', value: '', placeholder: '请输入统一受案号', itemId: 1, name: 'input' },
                    { dom: 'bmsah', value: '', placeholder: '请输入部门受案号', itemId: 2, name: 'input' },
                    { dom: 'case_name', value: '', placeholder: '请输入案件名', itemId: 3, name: 'input' },
                    { dom: 'case_take_user_name', value: '', placeholder: '请输入承办人', itemId: 4, name: 'input' },
                ],
                selectOption_right: {},
                showModel_right: {
                    tableData_top:[],   // 数据信息
                    tableData_bottom:[],   // 数据信息
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
                    { title: 'is_old', dataIndex: '是否绑定当前卷宗', itemId: 5 },
                ],
            }
           
        },
        mounted(){
            this.pagination_left.org_id = this.pagination_right.org_id = this.org_id
            this.getTableList_left(this.pagination_left);
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
                this.dataLoading = true;
                const resultData = await this.$api.historyExhibitList(dataInfo);
                if(resultData && resultData.code=='0'){
                    const pagination = { ...this.pagination_left };
                    this.showModel_left.tableData = resultData.data.list;
                    pagination.total = resultData.data.total;
                    this.pagination_left = pagination;
                    this.dataLoading = false;
                }
                
            },
            // 确认搜索
            comfirmSearch_left(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_left[key] = data[key] }  })
                this.getTableList_left(this.pagination_left)
            },
            // 导出
            openExportExcelFun_left(data){
                this.$nextTick(()=>{
                    // window.open(this.base_url+'/?'+exportExcelFun(data))
                })
            },
            async selectCellItem(cellData){
                this.loading_right_top = true;
                this.exhibitTemporaryId = cellData.exhibit_id;
                const dataInfo = {
                    exhibit_id:cellData.exhibit_id,
                    province_id: this.pagination_left.province_id,
                    city_id: this.pagination_left.city_id,
                    area_id: this.pagination_left.area_id,
                    org_id: this.org_id
                }
                let resultData = await this.$api.getExhibitLikeCases(dataInfo)
                if(resultData && resultData.code == '0'){
                    this.showModel_right.tableData_top = resultData.data
                    this.loading_right_top = false;
                }
            },
            async bindCaseForExhibit(case_id){
                let resultData = await this.$api.attachExhibitToCase({ exhibit_id:this.exhibitTemporaryId,case_id })
                this.selectCellItem({exhibit_id: this.exhibitTemporaryId})
                if(resultData && resultData.code == '0') {
                    this.$message.success('操作成功')
                    this.$refs.singleTable.setCurrentRow('');
                    this.exhibitTemporaryId = ''
                }
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
                const resultData = await this.$api.getLikeCases(dataInfo);
                const pagination = { ...this.pagination_right };
                this.showModel_right.tableData_bottom = resultData.data;
                pagination.total = resultData.data.total;
                this.pagination_right = pagination;
            },
            
            // 确认搜索
            comfirmSearch_right(data){
                this.$nextTick(()=>{ for(let key in data){ this.pagination_right[key] = data[key] }  })
                this.getTableList_right(this.pagination_right)
            },
            openExportExcelFun_right(data){
                console.log(data)
                this.$nextTick(()=>{
                    console.log(this.base_url+'/?case_bh='+data.case_bh+'&bmsah='+ data.bmsah+'&case_name='+ data.case_name+
                        '&case_take_user_name='+ data.case_take_user_name+'&province_id='+data.province_id+ 
                        '&city_id='+data.city_id+ '&area_id='+data.area_id)
                    // window.open(this.base_url+'/?case_bh='+data.case_bh+'&bmsah='+ data.bmsah+'&case_name='+ data.case_name+
                        // '&case_take_user_name='+ data.case_take_user_name+'&province_id='+data.province_id+ 
                        // '&city_id='+data.city_id+ '&area_id='+data.area_id)
                })
            },
        },
    }
</script>
<style lang="scss">
    .bySelfMatchPage{
        display: inline-flex;
        width: 100%;
        .bindCheckBox{
            width: 50%;
            padding: 10px;
        }
        .right_bottom{
            max-height: 70%;
        }
        .head-tab{
            padding-top: 30px;
            &.right_top{
                max-height: 30%;
                overflow-y: auto;
            }
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
