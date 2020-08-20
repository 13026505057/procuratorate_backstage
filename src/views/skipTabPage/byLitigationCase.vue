<template>
    <div class="byLitigationCasePage">
        <div class="table-dataList" >
            <el-table :data="showModel.tableData" border style="width: 100%" v-loading="tableLoading">
                <el-table-column align="center" type="index" label="#"></el-table-column>
                <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                    v-for="item in columns" :key="item.itemId" align="center" >
                    <template slot-scope="{row}">
                        <span @click="caseDetailClick({row})"  v-if="item.itemId == 2">
                            <a class="handleClick">{{ row[item.title] }}</a>
                        </span>
                        <span v-else>{{ row[item.title] }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { exportExcelFun } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
    computed :{
            ...mapGetters(['base_url'])
        },
    data(){
        return{
            showModel: {
                tableData: []
            },
            tableLoading: false,
            // table表头
            columns: [
                { title: 'ajlb_mc', dataIndex: '类型', itemId: 1 },
                { title: 'quantity', dataIndex: '数量（点击蓝色字导出详情）', itemId: 2 },
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
        exportExcelFunForObj(){

        },
        // 获取受理未归档案件列表
        async shouli_weibanjie(dataInfo){
            this.tableLoading = true;
            let subInfo = { ...dataInfo }
            delete subInfo.type
            const resultData = await this.$api.getShouliWeiBanjie(subInfo);
            this.showModel.tableData = resultData.data;
            // console.log(this.showModel.tableData)
            this.tableLoading = false;
        },
        // 获取办结未归档案件列表
        async shouli_weiguidang(dataInfo){
            this.tableLoading = true;
            let subInfo = { ...dataInfo }
            delete subInfo.type
            const resultData = await this.$api.getBanJieWeiGuiDang(subInfo);
            this.showModel.tableData = resultData.data;
            // console.log(this.showModel.tableData)
            this.tableLoading = false;
        },
        //分类详情点击导出事件
        caseDetailClick(dataInfo){
            let urlQuery = this.$route.query;
            console.log(dataInfo)
            urlQuery.case_type_id = dataInfo.row.case_type_id;
            urlQuery.ajlb_bm = dataInfo.row.ajlb_bm;
            if(urlQuery.type=='shouli_weiguidang'){
                window.open(this.base_url+'/chart/exportBanJieWeiGuiDang3?'+exportExcelFun(urlQuery))
            }else{
                window.open(this.base_url+'/chart/exportShouliWeiBanjie3?'+exportExcelFun(urlQuery))
            }
            
        }
    }
}
</script>

<style lang="scss">
    .byLitigationCasePage{
        margin: 20px;
        .table-dataList{
            margin-top: 20px;
            .handleClick{
                color: cornflowerblue;
                text-decoration: underline;
            }
        }
    }
</style>