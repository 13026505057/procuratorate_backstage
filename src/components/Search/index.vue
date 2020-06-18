<template>
    <div class="searchInfo">
        <div class="searchItem" v-for="item in searchList" :key="item.dom">
            <template v-if="item.name == 'input'">
                <el-input v-model="item.value" :placeholder="item.placeholder" 
                    class="item"></el-input>
            </template>
            <template v-else-if="item.name == 'datePicker'">
                <el-date-picker v-model="item.value" :placeholder="item.placeholder" 
                    type="year" class="item" value-format="yyyy"></el-date-picker>
            </template>
            <template v-else-if="item.name == 'select'">
                <el-select v-model="item.value" placeholder="请选择">
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.value" :label="itemChild.label" :value="itemChild.value">
                    </el-option>
                </el-select>
            </template>
        </div>
        <el-button type="search" @click="comfirmSearch">查询</el-button>
    </div>
</template>

<script>
export default {
    props: {
        resetData: [Boolean],
        addSearch: [Array],
        selectOption: [Object],
    },
    data(){
        return{
            searchList: [
                { dom: 'num', value: '', placeholder: '请输入案卷号', itemId: 0, name: 'input' },
                { dom: 'name', value: '', placeholder: '请输入案卷名称', itemId: 1, name: 'input' },
                { dom: 'fzname', value: '', placeholder: '请输入罪名', itemId: 2, name: 'input' },
                { dom: 'year', value: '', placeholder: '请选择年份', itemId: 3, name: 'datePicker' },
            ]
        }
    },
    mounted(){
        if(this.resetData) this.searchList = this.addSearch
            else if(this.addSearch && this.addSearch.length>0) this.searchList.push(...this.addSearch)
        
    },
    methods: {
        comfirmSearch(){
            let dataInfo = {}
            this.searchList.map(item=>{
                dataInfo[item.dom] = item.value
            })
            this.$emit('comfirmSearch',dataInfo)
        }
    }
}
</script>
<style lang="scss">
    .searchInfo{
        border: 1px solid #8fcbff;
        background-color: #eaf5ff;
        padding: 15px 0;
        .searchItem{
            width: auto;
            display: inline-block;
            margin: 0 15px;
            .item{
                border: 1px solid #8fcbff;
                border-radius: 3px;
                width: auto;
                input{
                    border: 0;
                }
            }
        }
    }
</style>