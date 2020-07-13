<template>
    <div class="litigationCasePage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            :hiddenAdress="false" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table v-loading="isLoading" :data="tableData" :header-cell-style="headerRowStyle"
                    border style="width: 100%">
                    <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
                    <el-table-column align="center" v-for="tableItem in tableItems" :prop="tableItem.prop"
                        :label="tableItem.label" :key="tableItem.label">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    import Search from '@/components/Search'
    import { mapGetters } from 'vuex'
    export default {
        components: { Search },
        data()  {
            return  {
                addSearch: [
                    { dom: 'over_time_begin', value: '',placeholder: '开始时间', itemId: 4, name: 'daterange_begin' },
                    { dom: 'over_time_end', value: '',placeholder: '结束时间', itemId: -4, name: 'daterange_end' },
                ],
                selectOption:{},
                tableData:[],
                tableItems:[
                    {label: "单位", prop: "org_name", tableId:1},
                    {label: "受理与结存案件数(件)", prop: "shouli_jiecun", tableId:2},
                    {label: "已办结案件数(件)", prop: "yibanjie", tableId:3},
                    {label: "未办结案件数(件)", prop: "weibanjie", tableId:4},
                    {label: "已归档案件数(件)", prop: "yiguidang", tableId:5},
                    {label: "未归档案件数(件)", prop: "weiguidang", tableId:5},
                    {label: "归档率(%)", prop: "guidanglv", tableId:5},
                ],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    slrq_begin: '',
                    slrq_end: ''
                },
                isLoading:false,
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
            comfirmSearch(data){
                // console.log(data)
                this.$nextTick(()=>{
                    let dataInfo = {
                        slrq_begin: data.over_time_begin,
                        slrq_end: data.over_time_end,
                    }
                    this.getDataList(dataInfo)
                })
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
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