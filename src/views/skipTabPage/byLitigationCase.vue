<template>
    <div class="byLitigationCasePage">
        <div class="table-dataList" >
            <el-table :data="showModel.tableData" border style="width: 100%" v-loading="tableLoading">
                <el-table-column align="center" type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                    v-for="item in columns" :key="item.itemId" align="center" :prop="item.title">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            showModel: {
                tableData: []
            },
            tableLoading: false,
            // table表头
            columns: [
                { title: 'ajlb_mc', dataIndex: '类型', itemId: 1 },
                { title: 'quantity', dataIndex: '数量', itemId: 2 },
            ],
        }
    },
    mounted(){
        this.getTableList(this.$route.query)
    },
    methods: {
        // 获取案件列表
        getTableList(dataInfo){
            console.log(dataInfo)
            this[dataInfo.type](dataInfo)
        },
        // 获取受理未归档案件列表
        async shouli_weibanjie(dataInfo){
            this.tableLoading = true;
            let subInfo = { ...dataInfo }
            delete subInfo.type
            const resultData = await this.$api.getShouliWeiBanjie(subInfo);
            this.showModel.tableData = resultData.data;
            this.tableLoading = false;
        },
        // 获取办结未归档案件列表
        async shouli_weiguidang(dataInfo){
            this.tableLoading = true;
            let subInfo = { ...dataInfo }
            delete subInfo.type
            const resultData = await this.$api.getBanJieWeiGuiDang(subInfo);
            this.showModel.tableData = resultData.data;
            this.tableLoading = false;
        },
    }
}
</script>

<style lang="scss">
    .byLitigationCasePage{
        margin: 20px;
        .table-dataList{
            margin-top: 20px;
        }
    }
</style>