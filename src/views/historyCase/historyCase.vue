<template>
  <div class="historyCasePage">
    <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'exhibit'" @comfirmSearch="comfirmSearch"
        @receivedAddress="receivedAddress" :setDynamicBtn="setDynamicBtn" @setDynamicBtnFun="setDynamicBtnFun" />
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
            <el-table-column align="center" label="操作" width="150">
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
    <!-- 案件导入 -->
    <el-dialog v-dialogDrag title="历史案件导入" :visible.sync="showModel.importCaseModel">
        <el-upload class="upload-demo" drag multiple :headers="showModel.headersUpload"
            :action="base_url + '/cases/cases/addByExcel'" :on-success="uploadSuccess" accept=".xls">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from '@/components/Search'
import { getToken } from '@/utils/auth'
export default {
    components: { Search },
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
    computed: {
        ...mapGetters(['base_url','stock_status'])
    },
  data() {
    return {
        pagination: {
            pageNum: 1,
            pageSize: 10,
            exhibit_status: '1'
        },
        loadingTable: false,
        showModel: {
            tableData:[],   // 数据信息
            // 导入
            importCaseModel: false,
            headersUpload: { 'kf-token': getToken() }
        },
        addSearch: [],
        selectOption: {
            stock_status: []
        },
        setDynamicBtn: [
            // { title: '导入', fun: 'importFun' },
            { title: '导出', fun: 'exprotFun' }
        ],
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
  mounted() {
      this.getTableList(this.pagination);
      this.getTypeList()
  },
  methods: {
    comfirmSearch(data){
        this.$nextTick(()=>{ for(let key in data){ this.pagination[key] = data[key] }  })
        this.getTableList(this.pagination)
    },
    setDynamicBtnFun(data){
        const statusMap = {
            "exprotFun": "openExportExcelFun",
            // "importFun": "importCaseBtn",
        }
        this[statusMap[data.fun]](data.dataInfo)
    },
    // 导入
    importCaseBtn(){
        this.showModel.importCaseModel = true;
    },
    uploadSuccess(response){
        if(response.code == '0') {
            this.showModel.importUserModel = false;
            this.$message.success('上传成功')
        } else {
            this.$message.warning(response.msg)
            this.$refs.uploadExcel.clearFiles()
        }
    },
    // 导出 
    openExportExcelFun(data){
        this.$nextTick(()=>{
            window.open(this.base_url+'/exhibit/exhibit/exoprtExhibits?'+exportExcelFun(data))
        })
    },
    receivedAddress(data){
        Object.keys(data).map(item=> this.pagination[item] = data[item] )
    },
    getTypeList(){
        let dataArr = [
            { showModel: 'stock_status', store: 'stock_status' },
        ]
        dataArr.map(item=> this.selectOption[item.showModel] = this[item.store] )
    },
    // 获取案件列表
    async getTableList(dataInfo){
        this.loadingTable = true;
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
        this.getTableList(this.pagination)
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