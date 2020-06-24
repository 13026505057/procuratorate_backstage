<template>
    <div class="dialogPagin">
        <!-- 分页 -->
        <el-pagination small background
            style="text-align: center;margin-top: 20px;padding-bottom:20px;"
            @current-change="dialogTablePagin" :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize" layout="prev, pager, next, jumper"
            :total="tableData.length">
        </el-pagination>
    </div>
</template>

<script>
export default {
    props: {
        tableData: [Array]
    },
    data(){
        return{
            pagination: {
                pageNum: 1,
                pageSize: 10,
            }
        }
    },
    methods:{
        returnTable(arr,page){
            return arr.slice((page-1)*this.pagination.pageSize,page*this.pagination.pageSize)
        },
        dialogTablePagin(val){
            const showTable = this.returnTable(this.tableData,val)
            this.$emit('dialogTablePagin',showTable)
        }
    }
}
</script>