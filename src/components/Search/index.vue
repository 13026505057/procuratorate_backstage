<template>
    <div class="searchInfo">
        <div class="searchItem" v-for="item in searchList" :key="item.itemId">
            <template v-if="item.name == 'input'">
                <el-input v-model="item.value" :placeholder="item.placeholder" 
                    class="item" clearable></el-input>
            </template>
            <template v-else-if="item.name == 'dataPicker'">
                <el-date-picker v-model="item.value" :placeholder="item.placeholder" :picker-options="pickerOptions"
                    type="year" class="item" value-format="yyyy" clearable></el-date-picker>
            </template>
            <template v-else-if="item.name == 'select'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable>
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.value" :label="itemChild.label" :value="itemChild.value">
                    </el-option>
                </el-select>
            </template>
            <template v-else-if="item.name == 'daterange'">
                <el-date-picker v-model="item.value" type="daterange" range-separator="至" clearable
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
            </template>
            <template v-else-if="item.name == 'selectTimeStatus'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable>
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.case_time_status" :label="itemChild.case_time_status_name" :value="itemChild.case_time_status">
                    </el-option>
                </el-select>
            </template>
        </div>
        <div class="searchItem" v-if="hiddenAdress">
            <template v-if="org_list[0].level !== 'area'">
                <el-cascader ref="treeOrg" placeholder="试试搜索：青岛市" v-model="selectOrgId" :options="org_list" 
                    :props="{ checkStrictly: true }" filterable clearable></el-cascader>
            </template>
        </div>
        <el-button class="searchItem" type="search" @click="comfirmSearch">查询</el-button>
        <el-button class="searchItem" v-for="item in setDynamicBtn" type="search" @click="setDynamicBtnFun(item.fun)" :key="item.title">{{ item.title }}</el-button>
        <el-button class="searchItem" type="search" @click="exportExcelFun" v-if="exportExcelBtn">导出</el-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        resetData: [Boolean],
        addSearch: [Array],
        selectOption: [Object],
        setDynamicBtn: [Array],
        hiddenAdress: {
            type: Boolean,
            default: true
        },
        exportExcelBtn: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['org_list','address_id'])
    },
    data(){
        return{
            selectOrgId: '',
            searchList: [
                { dom: 'case_bh', value: '', placeholder: '统一受案号', itemId: 0, name: 'input' },
                { dom: 'case_name', value: '', placeholder: '请输入案卷名称', itemId: 1, name: 'input' },
                { dom: 'bgr', value: '', placeholder: '请输入嫌疑人', itemId: 2, name: 'input' },
                { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
            ],
            org_dataList: [{level:'area'}],
            pickerOptions: {
                disabledDate(time) {
                    return time.getFullYear() < 2013 || time.getFullYear() >= new Date().getFullYear()+1
                }
            },
        }
    },
    created(){
        this.$emit('receivedAddress',this.address_id)
        if(this.resetData) this.searchList = this.addSearch
            else if(this.addSearch && this.addSearch.length>0) this.searchList.push(...this.addSearch)
        
    },
    methods: {
        setDynamicBtnFun(fun){
            let dataInfo = this.resultDataInfo()
            this.$emit('setDynamicBtnFun',{ fun,dataInfo })
        }, 
        comfirmSearch(){
            let dataInfo = this.resultDataInfo()
            this.$emit('comfirmSearch',dataInfo)
        },
        resultDataInfo(){
            let dataInfo = {}
            this.searchList.map(item=>{
                dataInfo[item.dom] = item.value
                if(this.selectOrgId && this.selectOrgId.length > 0){
                    this.$nextTick(()=>{
                        const { data } = this.$refs.treeOrg.getCheckedNodes()[0];
                        ['province_id','city_id','area_id'].map(keys=> dataInfo[keys] = data[keys] )
                    })
                } else this.$nextTick(()=>{ ['province_id','city_id','area_id'].map(keys=> dataInfo[keys] = this.address_id[keys] ) })
                if(item.dom == 'timeData') {
                    if(dataInfo.timeData && dataInfo.timeData.length>0) {
                        dataInfo.begin_time = dataInfo.timeData[0]
                        dataInfo.end_time = dataInfo.timeData[1]
                    } else dataInfo.begin_time = dataInfo.end_time = ''
                }
                delete dataInfo.timeData
            })
            return dataInfo
        },
        exportExcelFun(){
            let dataInfo = this.resultDataInfo()
            this.$emit('exportExcelFun',dataInfo)
        },
    }
}
</script>
<style lang="scss">
    .searchInfo{
        border: 1px solid #8fcbff;
        background-color: #eaf5ff;
        padding-bottom: 15px;
        .searchItem{
            width: auto;
            display: inline-block;
            margin: 15px 15px 0 15px;
            .item{
                border: 1px solid #8fcbff;
                border-radius: 3px;
                width: auto;
                input{
                    border: 0;
                }
            }
            input{
                width: 190px;
                
            }
        }
        .el-button:hover, .el-button:focus {
            color: #ffffff;
        }
    }
</style>