<template>
    <div class="litigationCasePage">
        <div class="searchInfo">
            <div class="searchItem" v-for="item in searchList" :key="item.itemId">
                <template v-if="item.name == 'select'">
                    <el-select v-model="seatchData[item.dom]" :placeholder="item.placeholder" >
                        <el-option v-for="itemChild in selectOption[item.dom]" :key="itemChild.value" 
                            :label="itemChild.label" :value="itemChild.value">
                        </el-option>
                    </el-select>
                </template>
                <template v-else-if="item.name == 'daterange_begin'">
                    <el-date-picker v-model="seatchData[item.dom]" type="datetime" :placeholder="item.placeholder" 
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
                        <el-table-column :label="itemChild.label" :prop="itemChild.prop"
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
            <div class="noteInfo">
                <div v-for="item in noteInfoList" :key="item.itemId" class="noteInfoBox">
                    <span class="noteInfoCaption">{{ item.captionTiele }}</span>
                    <li class="noteInfoItem" v-for="itemChild in item.children" 
                        :key="itemChild.itemId">{{ itemChild.title }}</li>
                </div>
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
                    { dom: 'weila_status', value: 'la_dao',placeholder: '是否包含不规范办结', itemId: 8, name: 'select' },
                    { dom: 'slrq_begin', placeholder: '开始时间', itemId: 4, name: 'daterange_begin' },
                    { dom: 'slrq_end', placeholder: '结束时间', itemId: -4, name: 'daterange_end' },
                ],
                selectOption:{
                    weila_status:[
                        { value:'la_dao', label:"不包含不规范办结",},
                        { value:'', label:"包含不规范办结",},
                    ]
                },
                tableData:[],
                tableItems:[
                    {label: "单位", prop: "org_name"},
                    {   label: '受理的案件', prop: "propTemporary",
                        children: [
                            { label: "应归案件数(件)", prop: "yingguidang" },
                            { label: "已办结案件数(件) A1", prop: "shouli_banjie" },
                            { label: "未办结案件数(件)", prop: "shouli_weibanjie", skip: true },
                            { label: "已归档案件数(件) B1", prop: "shouli_yiguidang" },
                            { label: "未归档案件数(件)", prop: "shouli_weiguidang", skip: true },
                        ]
                    },
                    {   label: '历史案件数(之前受理，于当前时间段办结)', prop: "propTemporary",
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
                    weila_status: 'la_dao',
                    slrq_begin: '' || `${new Date().getFullYear()}-01-01 00:00:00`,
                    slrq_end: '' || `${parseTime(new Date())}`
                },
                isLoading:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getFullYear() >= new Date().getFullYear()+1
                    }
                },
                noteInfoList: [
                    {   captionTiele: '一、受理的案件数据',
                        children: [
                            { title: '1、应归案件数：符合省院下发的案件归档范围的，所选定时间段内受理的案件数（含办结、未办结）.应归=已办结+未办结' },
                            { title: '2、已办结案件数:等于受理且办结的案件总数。已办结=已归数+未归数。' },
                            { title: '3、未办结案件数:等于受理且未办结的案件总数。' },
                            { title: '4、归档案件数：等于受理、办结且归档的案件总数。' },
                            { title: '5、未归档案件数：=已办结数-已归数。' },
                        ]
                    },
                    {   captionTiele: '二、历史数据',
                        children: [
                            { title: '6、已办结案件数:等于所选定时间段内前受理，但于所选定时间段内内办结的案件总数。' },
                            { title: '7、归档案件数：等于所选定时间段前受理，但于所选定时间段内办结且归档的案件总数。' },
                            { title: '8、归档率（%）：等于已归档数之和/已办结数之和，小数点保留2位。' },
                            { title: '9、排名：本地区排名。' },
                        ]
                    },
                ]
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
                let switch_begin = Boolean(this.seatchData.slrq_begin)
                let switch_end = Boolean(this.seatchData.slrq_end)
                let resultData = [
                    { dom: 'slrq_begin', search: Boolean(this.seatchData.slrq_begin), message: '开始时间不能为空' },
                    { dom: 'slrq_end', search: Boolean(this.seatchData.slrq_end), message: '结束时间不能为空' },
                ]
                resultData.map((item,index)=>{
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
                   "shouli_weibanjie": "/skipTabPage/byLitigationCase",
                   "shouli_weiguidang": "/skipTabPage/byLitigationCase"
                }
                if(skipPageData[column.property]) {
                    const { href } = Router.resolve({
                        path: skipPageData[column.property],
                        query: { ...this.seatchData,org_id: row['org_id'],type: column.property }
                    });
                    console.log(href)
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
            .noteInfo{
                .noteInfoBox{
                    margin: 10px;
                    .noteInfoCaption{
                        margin-bottom: 5px;
                        display: inline-block;
                        font-weight: 600;
                    }
                    .noteInfoItem{
                        list-style: none;
                }
                }
            }
        }
    }
</style>