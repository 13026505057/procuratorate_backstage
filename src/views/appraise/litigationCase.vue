<template>
    <div class="litigationCasePage">
        <div class="searchInfo">
            <div class="searchItem" v-for="item in searchList" :key="item.itemId">
                <template v-if="item.name == 'daterange_begin'">
                    办结区间：  <el-date-picker v-model="seatchData[item.dom]" type="datetime" :placeholder="item.placeholder" 
                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
                </template>
                <template v-else-if="item.name == 'daterange_end'">
                    <el-date-picker v-model="seatchData[item.dom]" type="datetime" :placeholder="item.placeholder" 
                        value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"></el-date-picker>
                </template>
            </div>
            <el-button class="searchItem" type="search" @click="comfirmSearch">查询</el-button>
        </div>
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table v-loading="isLoading" :data="tableData" :header-cell-style="headerRowStyle"
                    border style="width: 100%" @cell-click="skipDetail">
                    <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
                    <el-table-column align="center" v-for="tableItem in tableItems" :prop="tableItem.prop"
                        :label="tableItem.label" :key="tableItem.label">
                        <el-table-column :label="itemChild.label"
                            align="center" v-for="itemChild in tableItem.children" :key="itemChild.label">
                            <template slot-scope="{ row }">
                                <div>
                                    <el-link type="primary" v-if="itemChild.skip">{{ row[itemChild.prop] }}</el-link>
                                    <span v-else>{{ row[itemChild.prop] }}</span>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { parseTime } from '@/utils'
    import { mapGetters } from 'vuex'
    import Router from '@/router'
    export default {
        components: { Search },
        data()  {
            return  {
                searchList: [
                    { dom: 'over_time_begin', placeholder: '开始时间', itemId: 4, name: 'daterange_begin' },
                    { dom: 'over_time_end', placeholder: '结束时间', itemId: -4, name: 'daterange_end' },
                ],
                tableData:[],
                tableItems:[
                    {label: "单位", prop: "org_name"},
                    {   label: `${new Date().getFullYear()}年受理的案件`, prop: "propTemporary",
                        children: [
                            { label: "应归档案件数(即该年受理数)", prop: "yingguidang" },
                            { label: "已办结案件数(即该区间办结数) A1", prop: "shouli_banjie" },
                            { label: "未办结案件数(即该年未办结案件数)", prop: "shouli_weibanjie", skip: true },
                            { label: "已归档案件数(件) B1", prop: "shouli_yiguidang" },
                            { label: "未归档案件数(件)", prop: "shouli_weiguidang", skip: true },
                        ]
                    },
                    {   label: `历史案件数(${new Date().getFullYear()}年之前受理，于当前时间段办结)`, prop: "propTemporary",
                        children: [
                            { label: "已办结案件数(件) A2", prop: "lishi_yibanjie" },
                            { label: "已归档案件数(件) B2", prop: "lishi_yiguidang" },
                        ]
                    },
                    { label: "归档率(%) (B1+B2)/(A1+A2)", prop: "guidanglv" },
                ],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    over_time_begin: '' || `${new Date().getFullYear()}-01-01 00:00:00`,
                    over_time_end: '' || `${parseTime(new Date())}`
                },
                isLoading:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getFullYear() >= new Date().getFullYear()+1
                    }
                },
            }
        },
        mounted(){
            this.getDataList(this.seatchData)
        },
        methods: {
            // 默认数据列表
            async getDataList(dataInfo){
                this.isLoading = true;
                const resultData = await this.$api.getShouLiJieCun(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            comfirmSearch(){
                let switch_begin = Boolean(this.seatchData.over_time_begin)
                let switch_end = Boolean(this.seatchData.over_time_end)
                let resultData = [
                    { dom: 'over_time_begin', search: Boolean(this.seatchData.over_time_begin), message: '开始时间不能为空' },
                    { dom: 'over_time_end', search: Boolean(this.seatchData.over_time_end), message: '结束时间不能为空' },
                ]
                resultData.map(item=>{
                    if(!item.search) this.$message.info(item.message)
                })
                if(switch_begin && switch_end) this.getDataList(this.seatchData)
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 跳转到指定页面
            skipDetail(row, column){
                let skipPageData = {
                   "未办结案件数(即该年未办结案件数)": "/skipTabPage/byLitigationCase",
                   "未归档案件数(件)": "/skipTabPage/byLitigationCase"
                }
                if(skipPageData[column.label]) {
                    const { href } = Router.resolve({
                        path: skipPageData[column.label],
                        query: { ...this.seatchData,org_id: row['org_id'],type: column.label }
                    });
                    window.open(href, '_blank');
                }
            }
        },
    }
</script>
<style lang="scss">
    .litigationCasePage{
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
            .tab-pane-position {
                position: relative;
            }
            .tab-badge-num{
                position: absolute;
                top: -2px;
            }
            .customClass{
                // background-color: #47ccff;
            }
            .step-flex{
                display: flex;
                justify-content: center;
                overflow-y: auto;
            }
            .dialog-footer button{
                margin: 0 60px;
            }
        }
    }
</style>