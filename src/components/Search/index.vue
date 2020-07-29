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
            <template v-else-if="item.name == 'autocomplete'">
                <el-autocomplete class="inline-input" clearable
                    v-model="item.value" :fetch-suggestions="querySearch" :placeholder="item.placeholder"
                    @focus="changeInputData(item.dom)"></el-autocomplete>
            </template>
            <template v-else-if="item.name == 'select'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable filterable>
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
            <template v-else-if="item.name == 'cascader'">
                <el-cascader :placeholder="item.placeholder" v-model="item.value" :options="selectOption[item.dom]" 
                    filterable clearable></el-cascader>
            </template>
            <template v-else-if="item.name == 'selectTimeStatus'">
                <el-select v-model="item.value" :placeholder="item.placeholder" clearable filterable>
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.case_time_status" :label="itemChild.case_time_status_name" :value="itemChild.case_time_status">
                    </el-option>
                </el-select>
            </template>
        </div>
        <div class="searchItem" v-if="hiddenAdress">
            <template v-if="org_list && org_list[0].level !== 'area'">
                <el-cascader ref="treeOrg" class="demonstration" placeholder="试试搜索：青岛市" v-model="selectOrgId" :options="org_list" 
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
        addSearch: {
            type: Array,
            default: []
        },
        selectOption: [Object],
        setDynamicBtn: [Array],
        type: [String],
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
            searchList: [],
            searchList_case: [
                { dom: 'case_bh', value: '', placeholder: '统一受案号', itemId: 0, name: 'input' },
                { dom: 'bmsah', value: '', placeholder: '部门受案号', itemId: -1, name: 'input' },
                { dom: 'case_name', value: '', placeholder: '请输入案件名称', itemId: 1, name: 'input' },
                { dom: 'bgr', value: '', placeholder: '请输入嫌疑人', itemId: 2, name: 'input' },
                { dom: 'case_take_user_name', value: '', placeholder: '请输入承办人', itemId: -2, name: 'input' },
                { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                { dom: 'over_time_begin', value: '',placeholder: '办结开始时间', itemId: 4, name: 'daterange_begin' },
                { dom: 'over_time_end', value: '',placeholder: '办结结束时间', itemId: -4, name: 'daterange_end' },
                { dom: 'slrq_begin', value: '',placeholder: '受理开始时间', itemId: -5, name: 'daterange_begin' },
                { dom: 'slrq_end', value: '',placeholder: '受理结束时间', itemId: -6, name: 'daterange_end' },
            ],
            searchList_case_sl: [
                { dom: 'case_bh', value: '', placeholder: '统一受案号', itemId: 0, name: 'input' },
                { dom: 'bmsah', value: '', placeholder: '部门受案号', itemId: -1, name: 'input' },
                { dom: 'case_name', value: '', placeholder: '请输入案件名称', itemId: 1, name: 'input' },
                { dom: 'case_take_user_name', value: '', placeholder: '请输入承办人', itemId: -2, name: 'input' },
                { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                { dom: 'over_time_begin', value: '',placeholder: '办结开始时间', itemId: 4, name: 'daterange_begin' },
                { dom: 'over_time_end', value: '',placeholder: '办结结束时间', itemId: -4, name: 'daterange_end' },
                { dom: 'slrq_begin', value: '',placeholder: '受理开始时间', itemId: -5, name: 'daterange_begin' },
                { dom: 'slrq_end', value: '',placeholder: '受理结束时间', itemId: -6, name: 'daterange_end' },
            ],
            searchList_exhibit: [
                { dom: 'tysah', value: '', placeholder: '统一受案号', itemId: 0, name: 'input' },
                { dom: 'out_exhibit_id', value: '', placeholder: '扫描条形码', itemId: -1, name: 'input' },
                { dom: 'exhibit_name', value: '', placeholder: '请输入案卷名称', itemId: 1, name: 'input' },
                { dom: 'bgr', value: '', placeholder: '请输入嫌疑人', itemId: 2, name: 'input' },
                { dom: 'cbr', value: '', placeholder: '请输入承办人', itemId: -2, name: 'input' },
                { dom: 'nd', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
            ],
            org_dataList: [{level:'area'}],
            pickerOptions: {
                disabledDate(time) {
                    return time.getFullYear() < 2013 || time.getFullYear() >= new Date().getFullYear()+1
                }
            },
            autocompleteSelect: ''
        }
    },
    created(){
        this.$emit('receivedAddress',this.address_id)
        const addSearchItem = (arrItem) => {
            if(arrItem && arrItem.length>0) {
                if(this.type == 'case') this.searchList.push(...this.searchList_case,...arrItem)
                    else if(this.type == 'case_sl') this.searchList.push(...this.searchList_case_sl,...arrItem)
                    else if(this.type == 'exhibit') this.searchList.push(...this.searchList_exhibit,...arrItem)
            } else {
                if(this.type == 'case') this.searchList.push(...this.searchList_case)
                    else if(this.type == 'case_sl') this.searchList.push(...this.searchList_case_sl)
                    else if(this.type == 'exhibit') this.searchList.push(...this.searchList_exhibit)
            }
        }
        if(this.resetData) this.searchList = this.addSearch
            else addSearchItem(this.addSearch)
    },
    methods: {
        changeInputData(dom){
            this.autocompleteSelect = dom
        },
        // 模糊搜索
        querySearch(queryString, cb) {
            const restaurants = this.selectOption[this.autocompleteSelect];
            const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        setDynamicBtnFun(fun){
            let dataInfo = this.resultDataInfo()
            this.$emit('setDynamicBtnFun',{ fun,dataInfo })
        }, 
        comfirmSearch(){
            let dataInfo = this.resultDataInfo()
            this.$emit('comfirmSearch',{ ...dataInfo,pageNum: 1 })
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
                if(item.dom == 'status_case') {
                    if(dataInfo.status_case && dataInfo.status_case.length>0) {
                        dataInfo.status_case = JSON.stringify(dataInfo.status_case)
                    }
                }
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
<style lang="scss" scope>
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
        }
        .el-button:hover, .el-button:focus {
            color: #ffffff;
        }
        
    }
    .el-popper.el-cascader__dropdown{
            .el-cascader-node>.el-radio{
                width: calc(100% - 20px);
                /* border: 0; */
                position: absolute;
                flex: 1;
                height: 100%;
                padding: 0 10px;
            }
            .el-radio__inner{
                border: 0;
                background: transparent;
            }
            .el-radio__inner::after{
                background-color: transparent;
            }
        }
</style>