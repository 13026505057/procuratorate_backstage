<template>
    <div class="historySearchInfo">
        <div class="searchItem" v-for="item in searchList" :key="item.itemId">
            <template v-if="item.name == 'input'">
                <el-input v-model="item.value" :placeholder="item.placeholder" 
                    class="item"></el-input>
            </template>
            <template v-else-if="item.name == 'dataPicker'">
                <el-date-picker v-model="item.value" :placeholder="item.placeholder" 
                    type="year" class="item" value-format="yyyy"></el-date-picker>
            </template>
            <template v-else-if="item.name == 'select'">
                <el-select v-model="item.value" :placeholder="item.placeholder">
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.value" :label="itemChild.label" :value="itemChild.value">
                    </el-option>
                </el-select>
            </template>
            <template v-else-if="item.name == 'daterange'">
                <el-date-picker v-model="item.value" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
            </template>
            <template v-else-if="item.name == 'selectTimeStatus'">
                <el-select v-model="item.value" :placeholder="item.placeholder">
                    <el-option v-for="itemChild in selectOption[item.dom]"
                        :key="itemChild.case_time_status" :label="itemChild.case_time_status_name" :value="itemChild.case_time_status">
                    </el-option>
                </el-select>
            </template>
        </div>
        <div class="searchItem settingBtn">
            <el-button type="search" @click="comfirmSearch">查询</el-button>
            <el-button type="search" @click="importCaseBtn">导入</el-button>
            <el-button type="search" @click="exportCaseBtn">导出</el-button>
            <!-- <el-button type="search" @click="comfirmSearch">新增</el-button> -->
            <!-- <el-button type="search" @click="comfirmSearch">人工匹配</el-button>
            <el-button type="search" @click="comfirmSearch">未绑查询</el-button>
            <el-button type="search" @click="comfirmSearch">匹配历史</el-button> -->
        </div>
        <!-- 案件导入 -->
        <el-dialog v-dialogDrag title="历史案件导入" :visible.sync="showModel.importCaseModel">
            <el-upload class="upload-demo" drag multiple :headers="showModel.headersUpload"
                :action="base_url + '/cases/cases/addByExcel'" :on-success="uploadSuccess">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
        </el-dialog>
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
    computed: {
        ...mapGetters(['org_list','address_id','base_url','case_type','stock_status'])
    },
    data(){
        return{
            searchList: [
                { dom: 'tysah', value: '', placeholder: '请输入统一涉案号', itemId: 0, name: 'input' },
                { dom: 'out_exhibit_id', value: '', placeholder: '请扫描案卷条码', itemId: 1, name: 'input' },
                { dom: 'exhibit_name', value: '', placeholder: '请输入案件名', itemId: 2, name: 'input' },
                { dom: 'nd', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
                { dom: 'case_type_id', value: '', placeholder: '请选择案件类型', itemId: 4, name: 'select' },
                { dom: 'stock_status', value: null, placeholder: '请选择案件状态', itemId: 5, name: 'select' },
            ],
            selectOption: {
                case_type_id: [],
                stock_status: []
            },
            showModel: {
                importCaseModel: false,
                headersUpload: { 'kf-token': getToken() }
            }
        }
    },
    mounted(){
        this.comfirmSearch();
        this.getDataList();
    },
    methods: {
        comfirmSearch(){
            let dataInfo = {}
            this.searchList.map(item=>{
                dataInfo[item.dom] = item.value
            })
            this.$emit('comfirmSearch',dataInfo)
        },
        // 导入
        importCaseBtn(){
            this.showModel.importCaseModel = true;
        },
        uploadSuccess(){
            this.showModel.importCaseModel = false;
            this.$message.success('上传成功')
        },
        // 导出
        exportCaseBtn(){
            let dataInfo = {};
            this.searchList.map(item=>{
                dataInfo[item.dom] = item.value
            })
            window.open(this.base_url+'/exhibit/exhibit/exoprtExhibits?exhibit_name='+dataInfo.exhibit_name+'&tysah='+
                dataInfo.tysah+'&nd='+dataInfo.nd+'&stock_status='+dataInfo.stock_status+'&out_exhibit_id='+dataInfo.out_exhibit_id)
        },
        getDataList(){
            let dataArr = [
                { showModel: 'case_type_id', store: 'case_type' },
                { showModel: 'stock_status', store: 'stock_status' },
            ]
            dataArr.map(item=> this.selectOption[item.showModel] = this[item.store] )
        }
    }
}
</script>
<style lang="scss">
    .historySearchInfo{
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
            &.settingBtn{
                margin-top: 15px;
            }
        }
    }
</style>