<template>
    <div class="searchInfo">
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
        <div class="searchItem">
            <template v-if="org_list[0].level !== 'area'">
                <el-cascader ref="treeOrg" placeholder="试试搜索：青岛市" v-model="selectOrgId" :options="org_list" 
                    :props="{ checkStrictly: true }" filterable clearable></el-cascader>
            </template>
        </div>
        <el-button type="search" @click="comfirmSearch">查询</el-button>
        <el-button type="search" @click="addCaseItem">新增案件</el-button>

        <!-- 新增案件 -->
        <el-dialog title="新增案件" :visible.sync="showModel.dialogReceivedVisible">
            <div class="addCaseBox_container">
                <div class="addCaseBox_item">
                    <div v-for="(item,index) in eachDataInfoList.slice(0,6)" :key="index" class="item">
                        <span> {{ item.captionTitle }}：</span>
                        <el-input v-model="submitDataInfo[item.dom]" v-if="item.type=='input'"
                            :placeholder="item.placeholder" style="width: auto"></el-input>
                        <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="addCaseBox_item">
                    <div v-for="(item,index) in eachDataInfoList.slice(6,11)" :key="index" class="item">
                        <span> {{ item.captionTitle }}：</span>
                        <el-input v-model="submitDataInfo[item.dom]" v-if="item.type=='input'"
                            :placeholder="item.placeholder" style="width: auto"></el-input>
                        <el-select v-model="submitDataInfo[item.dom]" :placeholder="item.placeholder" v-else-if="item.type == 'select'">
                            <el-option v-for="itemChild in showModel[item.dom]" :key="itemChild.value" 
                                :label="itemChild.label" :value="itemChild.value"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModel.dialogReceivedVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddCase">确 定</el-button>
            </span>
        </el-dialog>
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
        ...mapGetters(['org_list','exhibit_type','exhibit_time_bg','case_type'])
    },
    data(){
        return{
            selectOrgId: '',
            searchList: [
                { dom: 'case_bh', value: '', placeholder: '请输入案卷号', itemId: 0, name: 'input' },
                { dom: 'case_name', value: '', placeholder: '请输入案卷名称', itemId: 1, name: 'input' },
                { dom: 'case_name', value: '', placeholder: '请输入罪名', itemId: 2, name: 'input' },
                { dom: 'timeYear', value: '', placeholder: '请选择年份', itemId: 3, name: 'dataPicker' },
            ],
            showModel: {
                // 新增案件
                dialogReceivedVisible: false,
                exhibit_type: [],
                bgqx: [],
                case_type_id: []
            },
            submitDataInfo: {
                exhibit_name: '',
                tysah: '',
                jh: '',
                cbr: '',
                bgqx: '',
                exhibit_type: '',
                nd: '',
                dh: '',
                ay: '',
                bgr: '',
                case_type_id: ''
            },
            eachDataInfoList: [
                { captionTitle: '案件名称', placeholder: '请输入案件名称', dom: 'exhibit_name', itemId: 1, type: 'input' },
                { captionTitle: '统一受案号', placeholder: '请输入统一受案号', dom: 'tysah', itemId: 2, type: 'input' },
                { captionTitle: '卷号', placeholder: '请输入卷号', dom: 'jh', itemId: 3, type: 'input' },
                { captionTitle: '承办人', placeholder: '请输入承办人', dom: 'cbr', itemId: 4, type: 'input' },
                { captionTitle: '期限', placeholder: '请选择期限', dom: 'bgqx', itemId: 5, type: 'select' },
                { captionTitle: '类型', placeholder: '请选择类型', dom: 'exhibit_type', itemId: 6, type: 'select' },

                { captionTitle: '年度', placeholder: '请输入年度', dom: 'nd', itemId: 7, type: 'input' },
                { captionTitle: '档号', placeholder: '请输入档号', dom: 'dh', itemId: 8, type: 'input' },
                { captionTitle: '案由', placeholder: '请输入案由', dom: 'ay', itemId: 9, type: 'input' },
                { captionTitle: '犯罪嫌疑人', placeholder: '请输入犯罪嫌疑人', dom: 'bgr', itemId:10, type: 'input' },
                { captionTitle: '类型', placeholder: '请选择案件类型', dom: 'case_type_id', itemId: 11, type: 'select' },
            ]
        }
    },
    mounted(){
        this.getTypeList();
    },
    methods: {
        comfirmSearch(){
            let dataInfo = {}
            this.searchList.map(item=>{
                dataInfo[item.dom] = item.value
                if(this.selectOrgId){
                    this.$nextTick(()=>{
                        const { data } = this.$refs.treeOrg.getCheckedNodes()[0];
                        ['province_id','city_id','area_id'].map(keys=> dataInfo[keys] = data[keys] )
                    })
                }
                if(item.dom == 'timeData') {
                    if(dataInfo.timeData && dataInfo.timeData.length>0) {
                        dataInfo.begin_time = dataInfo.timeData[0]
                        dataInfo.end_time = dataInfo.timeData[1]
                    } else dataInfo.begin_time = dataInfo.end_time = ''
                }
                delete dataInfo.timeData
            })
            this.$emit('comfirmSearch',dataInfo)
        },
        async addCaseItem(){
            this.showModel.dialogReceivedVisible = true;
        },
        async confirmAddCase(){
            let resultData = await this.$api.addOldExhibit(this.submitDataInfo)
            if(resultData && resultData.code =='0') {
                this.showModel.dialogReceivedVisible = false;
                this.$message.success('操作成功')
            }

        },
        getTypeList(){
            let dataArr = [
                { showModel: 'bgqx', store: 'exhibit_time_bg' },
                { showModel: 'exhibit_type', store: 'exhibit_type' },
                { showModel: 'case_type_id', store: 'case_type' },
            ]
            dataArr.map(item=> this.showModel[item.showModel] = this[item.store] )
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
        .addCaseBox_container{
            display: inline-flex;
            width: 100%;
            .addCaseBox_item{
                width: 50%;
                .item{
                    display:table;
                    width: 100%;
                    margin-bottom: 10px;
                    >span{
                        display:table-cell;
                        width: 35%;
                        text-align: right;
                        padding-right: 20px;
                    }
                }
            }
        }
    }
</style>