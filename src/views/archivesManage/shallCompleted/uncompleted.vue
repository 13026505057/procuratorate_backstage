<template>
    <div class="uncompletedShall">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
        <div class="head-tab">
            <el-tabs v-model="activeNameTab" @tab-click="handleClickTab">
                <el-tab-pane class="tab-pane-position" v-for="item in tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table height="500" :data="tableData" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :label="item.dataIndex"
                                v-for="item in columns" :key="item.itemId" align="center">
                                <template slot-scope="{row}">
                                    <span v-if="item.itemId == 4">{{ row[item.title]=='0'?'未交卷':'已交卷' }}</span>
                                    <span v-else>{{ row[item.title] }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="props">
                                    <!-- <el-button @click="examineClick" class="highlight-btn" size="small">案件进度</el-button>
                                    <el-button @click="detailsClick" class="ash-btn" size="small">未完成</el-button> -->
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <!-- 分页 -->
                        <el-pagination small background
                            style="text-align: center;margin-top: 20px;padding-bottom:20px;"
                            @current-change="handleCurrentChange"
                            :current-page.sync="pagination.pageNum"
                            :page-size="pagination.pageSize"
                            layout="prev, pager, next, jumper"
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
    export default {
        components: { Search },
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
                },
                addSearch: [
                    { dom: 'case_take_user_name', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                selectOption: {},
                activeNameTab: "0",
                tableList:[],
                tableData:[],
                columns: [
                    { title: 'case_bh', dataIndex: '案件编号', itemId: 1, fixed: true },
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
                console.log(activeCaseId)
            },
            // 类型分类
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.tableList = res.data.list;
                    this.pagination.case_type_id = this.activeNameTab = res.data.list[0].case_type_id
                    // 角标
                    const resultData = await this.$api.getCornerMarkType();
                    Object.keys(resultData.data).map(item=>{
                        res.data.list.map((itemChild,index)=>{
                            if("_"+itemChild.case_type_id == item) {
                                itemChild.contNum = resultData.data[item]
                                this.$set(this.tableList[index],index,itemChild)
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
                this.tableData = resultData.data.list;
                pagination.total = resultData.data.total;
                this.pagination = pagination;
            },
            comfirmSearch(data){
                for(let key in data){ this.pagination[key] = data[key] }
                this.getTableList(this.pagination)
            },
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
