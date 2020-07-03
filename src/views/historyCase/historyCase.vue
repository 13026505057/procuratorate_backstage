<template>
  <div class="historyCasePage">
    <HistorySearch @comfirmSearch="comfirmSearch"/>
    <div class="table-dataList" >
        <el-table :data="showModel.tableData" border style="width: 100%" v-loading="loadingTable">
            <el-table-column align="center" type="index"></el-table-column>
            <el-table-column :label="item.dataIndex" :show-overflow-tooltip="item.overflow"
                v-for="item in columns" :key="item.itemId" align="center">
                <template slot-scope="{row}">
                    <span v-if="item.itemId == 4">{{ row[item.title] | mapStatus }}</span>
                    <span v-else-if="item.itemId == 7">{{ row[item.title]=='none'?'未入库':'已入库' }}</span>
                    <span v-else>{{ row[item.title] }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                    <el-button @click="deleteItem(row.exhibit_id)" class="highlight-btn" size="small" type="danger">作废</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination">
        <!-- 分页 -->
        <el-pagination small background
            style="text-align: center;margin-top: 20px;padding-bottom:20px;"
            @current-change="handleCurrentChange" :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize" layout="prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistorySearch from '@/components/HistorySearch/search'

export default {
  components: { HistorySearch },
  filters: {
      mapStatus(status){
          const statusMap = {
              'SS': '诉讼',
              'JS': '技术',
              'WS': '文书',
          }
          return statusMap[status]
      }
  },
  data() {
    return {
        pagination: {
            pageNum: 1,
            pageSize: 10,
            tysah: '',
            out_exhibit_id: '',
            exhibit_name: '',
            nd: '',
            case_type_id: '',
            stock_status: ''
        },
        loadingTable: false,
        showModel: {
            tableData:[],   // 数据信息
        },
        // table表头
        columns: [
            { title: 'tysah', dataIndex: '统一受案号', itemId: 1 },
            { title: 'out_exhibit_id', dataIndex: '条形码号', itemId: 10 },
            { title: 'dh', dataIndex: '档号', itemId: 2 },
            { title: 'jh', dataIndex: '卷号', itemId: 11 },
            { title: 'exhibit_name', dataIndex: '案卷名称', itemId: 3 },
            { title: 'exhibit_type', dataIndex: '案卷类型', itemId: 4 },
            { title: 'cell_name', dataIndex: '存放位置', itemId: 5 },
            { title: 'nd', dataIndex: '年度', itemId: 6 },
            { title: 'stock_status', dataIndex: '入库状态', itemId: 7 },
            { title: 'case_type_name', dataIndex: '隶属案件类型', itemId: 8 },
        ],
    }
  },
  methods: {
    comfirmSearch(data){
        for(let key in data){ this.pagination[key] = data[key] }
        this.getTableList()
    },
    // 获取案件列表
    async getTableList(){
        this.loadingTable = true;
        let dataInfo = { ...this.pagination }
        dataInfo.exhibit_status = '1';
        let resultData = await this.$api.historyExhibitList(dataInfo)

        const pagination = { ...this.pagination };
        this.showModel.tableData = resultData.data.list;
        pagination.total = resultData.data.total;
        this.pagination = pagination;
        this.loadingTable = false;
    },
    // 分页
    handleCurrentChange(val) {
        this.pagination['pageNum'] = val;
        this.getTableList()
    },
    // 作废
    async deleteItem(exhibit_id){
        let resultData = await this.$api.editCaseData({exhibit_id,exhibit_status:'0'})
        if(resultData && resultData.code=='0') {
            this.getTableList();
            this.$message.success('操作成功')
        }
    },
    
  }
}
</script>

<style lang="scss">
  .historyCasePage{
    padding: 20px;
    .table-dataList{
        margin-top: 20px;
    }
    .upload-demo{
        text-align: center;
    }
  }
</style>