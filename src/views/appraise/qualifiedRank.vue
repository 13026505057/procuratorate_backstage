<template>
    <div class="qualifiedRankPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="true" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" />
        <div class="head-tab">
            <div class="table-dataList" >
                <el-table v-loading="isLoading" :data="tableData" :header-cell-style="headerRowStyle"
                    border style="width: 100%">
                    <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
                    <el-table-column align="center" v-for="tableItem in tableItems" :prop="tableItem.prop"
                        :label="tableItem.label" :key="tableItem.label">
                        <template slot-scope="{row}">
                            <span v-if="tableItem.tableId == 2">{{Number(row.none_count)+Number(row.in_count)}}</span>
                            <span v-else>{{row[tableItem.prop]}}</span>
                        </template>
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
        computed:{
            ...mapGetters(['org_id','base_url','org_list'])
        },
        data()  {
            return  {
                addSearch: [
                    { dom: 'timeYear', value: '',placeholder: '请选择年份', itemId: 6, name: 'dataPicker' },
                    { dom: 'status_case', value: ['sl'],placeholder: '请选择查询状态', itemId: 7, name: 'cascader' },
                ],
                selectOption:{ 
                    status_case: [
                        { value: 'sl', label: '按受理年度' },
                        { value: 'bj', label: '按办结年度' },
                    ]
                },
                tableData:[],
                tableItems:[
                    {label: "单位名称", prop: "org_name", tableId:1},
                    {label: "应交卷数量", prop: "", tableId:2},
                    {label: "实交卷数量", prop: "in_count", tableId:3},
                    {label: "超期未交卷数量", prop: "chaoqi_count", tableId:4},
                    {label: "交卷率", prop: "persent", tableId:5},
                ],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    timeYear:'',
                    case_name:'',
                    case_bh:'', //统一受案号
                    case_take_user_name:'',
                    status_case: JSON.stringify(['sl'])
                },
                isLoading:false,
            }
        },
        mounted(){
            this.getDataList(this.seatchData)
        },
        methods: {
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 默认数据列表
            async getDataList(dataInfo){
                // 受理和办结
                let status = dataInfo.status_case
                let dataList = [
                    { dom: ["sl"], fun: "caseJaugeAllSlrq" },
                    { dom: ["bj"], fun: "caseJaugeAll" },
                ]
                dataList.map(item=>{
                    if(status == JSON.stringify(item.dom)) {
                        delete dataInfo.status_case;
                        this[item.fun](dataInfo)
                    }
                })
            },
            //查询地级市的归档率 - 受理
            async caseJaugeAllSlrq(dataInfo){
                this.isLoading = true;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['area_id'] = '';
                const resultData = await this.$api.caseJaugeAllSlrq(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            //查询地级市的归档率 - 办结
            async caseJaugeAll(dataInfo){
                this.isLoading = true;
                dataInfo ['nd'] = this.seatchData.timeYear;
                dataInfo ['area_id'] = '';
                const resultData = await this.$api.caseJaugeAll(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data;
                    this.isLoading = false
                }
            },
            comfirmSearch(data){
                // console.log(data)
                this.$nextTick(()=>{ 
                    for(let key in data) { this.seatchData[key] = data[key] } 
                    this.getDataList(this.seatchData)
                })
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
        },
    }
</script>
<style lang="scss">
    .qualifiedRankPage{
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
