<template>
    <div class="exportSearch">
        <div class="searchItem" v-for="item in searchList" :key="item.itemId">
            <template v-if="item.name == 'input'">
                <el-input v-model="item.value" :placeholder="item.placeholder" 
                    class="item" clearable></el-input>
            </template>
            <template v-else-if="item.name == 'dataPicker'">
                <el-date-picker v-model="item.value" :placeholder="item.placeholder" clearable
                    type="year" class="item" value-format="yyyy" :picker-options="pickerOptions"></el-date-picker>
            </template>
            <template v-else-if="item.name == 'select'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable>
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.value" :label="itemChild.label" :value="itemChild.value">
                    </el-option>
                </el-select>
            </template>
            <template v-else-if="item.name == 'daterange_begin'">
                <el-date-picker v-model="item.value" type="datetime" :placeholder="item.placeholder" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00"></el-date-picker>
            </template>
            <template v-else-if="item.name == 'daterange_end'">
                <el-date-picker v-model="item.value" type="datetime" :placeholder="item.placeholder" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59"></el-date-picker>
            </template>
            <template v-else-if="item.name == 'selectTimeStatus'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable>
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.case_time_status" :label="itemChild.case_time_status_name" :value="itemChild.case_time_status">
                    </el-option>
                </el-select>
            </template>
        </div>
        <div class="searchItem">
            <template v-if="org_list[0].level !== 'area'">
                <el-cascader ref="treeOrg" placeholder="试试搜索：青岛市" v-model="selectOrgId" :options="org_list" 
                    :props="{ checkStrictly: true }" filterable clearable></el-cascader>
            </template>
        </div>
        <el-button class="searchItem" type="search" @click="comfirmSearch">查询</el-button>
        <el-button class="searchItem" type="search" @click="exportData">导出</el-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        resetData: [Boolean],
        addSearch: [Array],
        selectOption: [Object],
    },
    computed: {
        ...mapGetters(['org_list','address_id'])
    },
    data(){
        return{
            selectOrgId: '',
            searchList: [
                { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                { dom: 'over_time_begin', value: '',placeholder: '开始时间', itemId: 4, name: 'daterange_begin' },
                { dom: 'over_time_end', value: '',placeholder: '结束时间', itemId: -4, name: 'daterange_end' },
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
        comfirmSearch(){
            let dataInfo = this.resultDataInfo()
            this.$emit('comfirmSearch',dataInfo)
        },
        exportData(){
            let dataInfo = this.resultDataInfo()
            this.$emit('exportDataInfo',dataInfo)
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
            })
            return dataInfo
        }
    }
}
</script>
<style lang="scss">
    .exportSearch{
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
        }
        .el-button:hover, .el-button:focus {
            color: #ffffff;
        }
    }
</style>