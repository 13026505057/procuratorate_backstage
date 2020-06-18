<template>
    <div class="unCompletedPage">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
        123123123
    </div>
</template>

<script>
import Search from '@/components/Search'
export default {
    components: { Search },
    data(){
        return{
            addSearch: [
                { dom: 'eac11', value: '',placeholder: '请选择年份', itemId: 5, name: 'input' },
                { dom: 'eac11123', value: '',placeholder: '请选择年份', itemId: 6, name: 'select' },
            ],
            selectOption: {
                
            }
        }
    },
    methods: {
        comfirmSearch(data){
            console.log(data,11111)
        }
    }
}
</script>

<style lang="scss" scope>
    // .unCompletedPage{

    // }
</style>