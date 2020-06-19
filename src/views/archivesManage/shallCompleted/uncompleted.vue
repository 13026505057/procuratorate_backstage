<template>
    <div class="uncompletedShall">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
        <div class="head-tab">
            <el-tabs v-model="showModel.activeNameTab" @tab-click="handleClickTab">
                <el-tab-pane class="tab-pane-position" v-for="item in showModel.tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table height="500" :data="showModel.tableData" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 4">{{ row[item.title]=='0'?'未交卷':'已交卷' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="{row}">
                                    <el-button @click="showDialogPanel(row.exhibits)" class="highlight-btn" size="small">已有案卷</el-button>
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
        <el-dialog title="案卷详情" :visible.sync="showModel.dialogTableVisible">
            <el-table :data="showModel.gridData" align="center">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex"
                    v-for="item in showModel.gridData_columns" :key="item.itemId" align="center">
                    <template slot-scope="{row}">
                        <span v-if="item.itemId == 6">{{ row[item.title]=='0'?'已入库':'待入库' }}</span>
                        <span v-else-if="item.itemId == 7">{{ row[item.title]=='0'?'失效':'有效' }}</span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="{row}">
                        <el-button @click="printQrCodeAgain(row.exhibit_id)" class="highlight-btn" type="operation" size="small">补打条码</el-button>
                        <el-button @click="printReceipt(row.exhibit_id)" class="highlight-btn" type="operation" size="small">打印回执单</el-button>
                        <el-button @click="deleteCancel(row.exhibit_id)" class="highlight-btn" type="operation" size="small">作废</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        computed:{
            ...mapGetters(['org_id'])
        },
        data()  {
            return  {
                pagination: {
                    pageNum: 1,
                    pageSize: 10,
                    case_name: '',
                    case_bh: '',
                    timeYear: '',
                    case_take_user_name: '',
                    case_none_status: '',
                    case_type_id: '',
                    org_id: '',
                },
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                    { dom: 'case_none_status', value: '',placeholder: '是否已交卷', itemId: 6, name: 'select' },
                ],
                selectOption: {
                    case_none_status: [
                        { value: 1, label: '未交卷' },
                        { value: 2, label: '已交卷(未上架)' },
                    ]
                },
                showModel: {
                    activeNameTab: "0",
                    tableList:[],   // 类型
                    tableData:[],   // 数据信息
                    // 案卷详情
                    dialogTableVisible: false,
                    gridData: [],
                    gridData_columns: [
                        { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 1 },
                        { title: 'case_name', dataIndex: '卷宗名称', itemId: 2 },
                        { title: 'dh', dataIndex: '档号', itemId: 3 },
                        { title: 'jh', dataIndex: '卷号', itemId: 4 },
                        { title: 'bgr', dataIndex: '被告人/嫌疑人', itemId: 5 },
                        { title: 'stock_status', dataIndex: '案卷状态', itemId: 6 },
                        { title: 'exhibit_status', dataIndex: '是否有效', itemId: 7 },
                        { title: 'case_type', dataIndex: '存储位置', itemId: 8 },
                    ]
                },
                // table表头
                columns: [
                    { title: 'case_bh', dataIndex: '案件编号', itemId: 1 },
                    { title: 'case_name', dataIndex: '案件名称', itemId: 10 },
                    { title: 'case_desc', dataIndex: '案件描述', itemId: 11 },
                    { title: 'case_type_name', dataIndex: '案件类型', itemId: 2 },
                    { title: 'case_take_user_name', dataIndex: '承办人', itemId: 3 },
                    { title: 'dangan_accept_status', dataIndex: '是否交卷', itemId: 4 },
                    { title: 'dangan_accept_time', dataIndex: '交卷日期', itemId: 5 },
                    { title: 'dangan_accept_day', dataIndex: '交卷天数', itemId: 6 },
                ],
            }
           
        },
        mounted(){
            this.pagination.org_id = this.org_id
            this.getCaseType();
        },
        methods: {
            // 分页
            handleCurrentChange(val) {
                this.pagination['pageNum'] = val;
                this.getTableList(this.pagination)
            },
            handleClickTab(e){
                this.pagination.case_type_id = e.paneName
                this.getTableList(this.pagination)
            },
            // 类型分类
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.showModel.tableList = res.data.list;
                    this.pagination.case_type_id = this.showModel.activeNameTab = res.data.list[0].case_type_id
                    // 角标
                    let dataInfo = {...this.pagination};
                    // 每个页面字段不同(cout_for)
                    dataInfo.cout_for = 'getDangAnWeiGui';

                    ['pageNum','pageSize','case_type_id'].map(item=> delete dataInfo[item])
                    const resultData = await this.$api.getCornerMarkType(dataInfo);
                    Object.keys(resultData.data).map(item=>{
                        res.data.list.map((itemChild,index)=>{
                            if("_"+itemChild.case_type_id == item) {
                                itemChild.contNum = resultData.data[item]
                                this.$set(this.showModel.tableList[index],index,itemChild)
                            }
                        })
                    })
                    this.getTableList(this.pagination)
                })
            },
            // 获取未归档案件列表
            async getTableList(dataInfo){
                this.loading = true;
                let getData = { ...dataInfo }
                const resultData = await this.$api.getDangAnWeiGui(getData);
                const pagination = { ...this.pagination };
                this.showModel.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
            },
            // 确认搜索
            comfirmSearch(data){
                for(let key in data){ this.pagination[key] = data[key] }
                this.getTableList(this.pagination)
            },
            showDialogPanel(dataInfo){
                this.showModel.dialogTableVisible = true;
                this.showModel.gridData = dataInfo;
            },
            // 补打条形码
            async printQrCodeAgain(exhibit_id){
                let resultData = await this.$api.printAgain({exhibit_id})
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 打印回执单
            async printReceipt(exhibit_id){
                let resultData = await this.$api.printAcceptReturn({exhibit_id})
                if(resultData && resultData.code == '0') this.$message.success('已发送打印请求')
            },
            // 作废
            async deleteCancel(exhibit_id){
                let resultData = await this.$api.editCaseData({exhibit_id,exhibit_status: 0})
                if(resultData && resultData.code == '0') this.$message.success('操作成功')
            }
        },
    }
</script>
<style lang="scss">
    .uncompletedShall{
        margin: 20px;
        .head-tab{
            margin-top: 30px;
            .table-dataList{
                height: 560px;
                // overflow-y: auto;
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
