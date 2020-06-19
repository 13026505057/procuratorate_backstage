<template>
    <div class="record-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
        <div class="head-tab">
            <el-tabs v-model="activeName" @tab-click="handleClickTab">
                <el-tab-pane class="tab-pane-position" v-for="item in tableList" :key="item.case_type_id" :name="item.case_type_id">
                    <span slot="label">
                        {{item.case_type_name}}
                        <el-badge :value="item.contNum" v-if="item.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table height="560" :data="tableData" border style="width: 100%">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column :prop="item.title" :label="item.dataIndex"
                                v-for="item in columns" :key="item.itemId" align="center">
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                                <template slot-scope="props">
                                    <el-button @click="examineClick" class="highlight-btn" size="small">案件进度</el-button>
                                    <el-button @click="detailsClick" class="ash-btn" size="small">未完成</el-button>
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
                        <!-- <div @click="handleCurrentChange1" class="page-change">确定</div> -->
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
                },
                addSearch: [
                    { dom: 'undertaker', value: '',placeholder: '请输入承办人', itemId: 5, name: 'input' },
                ],
                selectOption: {},
                activeName: "0",
                tableList:[],
                tableData:[],
                columns: [
                    // { title: 'project_patient_name', dataIndex: '患者姓名', itemId: 1, fixed: true },
                    // { title: 'out_trade_no', dataIndex: '订单编号', itemId: 10 },
                    // { title: 'out_trade_no_dd', dataIndex: '订单流水编号', itemId: 11 },
                    // { title: 'project_patient_card_id', dataIndex: '患者身份证号', itemId: 2 },
                    // { title: 'patient_type_name', dataIndex: '与本人关系', itemId: 3 },
                    // { title: 'patient_tel', dataIndex: '联系方式', itemId: 4 },
                    // { title: 'project_name', dataIndex: '项目名称', itemId: 5 },
                    // { title: 'project_address', dataIndex: '地址', itemId: 6 },
                    // { title: 'project_menu_name', dataIndex: '套餐名称', itemId: 7 },
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
            handleClickTab(activeCaseId){
                console.log(activeCaseId)
            },
            // 类型分类
            getCaseType(){
                this.$api.getCaseType().then(async (res)=>{
                    this.tableList = res.data.list;
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
                    // this.getTableList(res.data.list[0].case_type_id)
                })
            },
            // 默认数据列表
            async getTableList(dataInfo){
                this.loading = true;
                let getData = { ...dataInfo }
                const resultData = await this.$api.getProgressCase(getData);
                const pagination = { ...this.pagination };
                this.tableData = resultData.data.list;
                pagination.total = returnData.data.total;
            },
            comfirmSearch(data){
                console.log(data,11111)
            },
        },
    }
</script>
<style lang="scss" scope>
    .record-content{
        margin: 20px;
    }
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
</style>
