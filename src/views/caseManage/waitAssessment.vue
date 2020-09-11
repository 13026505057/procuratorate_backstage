<template>
    <div class="wait-content">
        <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" :type="'case'" @comfirmSearch="comfirmSearch" 
            @receivedAddress="receivedAddress" @exportExcelFun="openExportExcelFun" :exportExcelBtn="true"/>
        <div style="display:flex;margin-top:5px;"><el-button size="mini"  style="background:rgb(94,189,255)!important;color:white" @click="tzpc">评查案件类型设置</el-button><div style="color:red; width:250px;line-height:28px;">以下案件类型不能进行一键评查：</div><Pmd :lists="lists" style="width:80%;line-height:28px;padding-left:10px"></Pmd></div>     
        <div class="head-tab">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane class="tab-pane-position" v-for="tabItem in tabItems" :key="tabItem.case_type_id" :name="tabItem.case_type_id" >
                    <span slot="label">
                        {{tabItem.case_type_name}}
                        <el-badge :value="tabItem.contNum" v-if="tabItem.contNum == '0'?false:true" class="item tab-badge-num"></el-badge>
                    </span>
                    <div class="table-dataList" >
                        <el-table v-loading="tableLoading" ref="multipleTable" :data="tableData" :header-cell-style="headerRowStyle"
                            border @selection-change="handleSelectionChange" style="width: 100%">
                            <el-table-column type="selection" width="55" :selectable='selectInit'> </el-table-column>
                            <el-table-column align="center" label="序号" width="60" type="index"></el-table-column>
                            <el-table-column
                                :show-overflow-tooltip="tableItem.overflow" align="center" v-for="tableItem in tableItems"
                                :prop="tableItem.prop" :label="tableItem.label" :key="tableItem.label" >
                                <template slot-scope="{row}">
                                    <span v-if="tableItem.tableId == 4">
                                        {{row[tableItem.prop]== 'in'?'已入库':'待入库'}}
                                    </span>
                                    <span v-else-if="tableItem.tableId == 5">{{row[tableItem.prop]==1?'超期':'未超期'}}</span>
                                    <span v-else-if="tableItem.tableId == 11">
                                        {{row[tableItem.prop.split('-')[0]]-row[tableItem.prop.split('-')[1]] }}
                                    </span>
                                    <span v-else>{{row[tableItem.prop]}}</span>
                                </template>
                            </el-table-column>
                             <el-table-column align="center" label="操作"  >
                                 <template slot-scope='{row}'>
                                    <el-button @click='yanq(row.case_id)'>延期交卷</el-button>
                                    <el-button style="margin-left:0px" @click="examination(row.case_id)">确认审查</el-button>
                                 </template>
                             </el-table-column>
                        </el-table>
                        <div class="check-all" style="margin-top: 10px">
                            <el-button :disabled="disabled1" :loading="disabled1" @click="toggleSelection(tableData,true)">全选</el-button>
                            <el-button :disabled="disabled1" :loading="disabled1" @click="toggleSelection(false)">取消选择</el-button>
                            <el-button :disabled="disabled2" :loading="disabled2" @click="confirmExamine()">确认已审查</el-button>
                        </div>
                    </div>
                    <div class="pagination">
                        <el-pagination
                            background
                            @current-change="handleCurrentChange1"
                            :current-page.sync="seatchData.pageNum"
                            :page-size="seatchData.pageSize"
                            layout="prev, pager, next, jumper"
                            :total="seatchData.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 延期交卷 -->
        <el-dialog v-dialogDrag title="延期交卷" :visible.sync="yanqi">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="延期日期">
                    <el-date-picker
                        v-model="form.to_time"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss" 
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="延期原因">
                    <el-input type="textarea" v-model="form.yanqi_reason"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="YQSubmit">确定</el-button>
                    <el-button @click="yanqi = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import Pmd from '@/components/Pmd'
    import Search from '@/components/Search'
    import { exportExcelFun } from '@/utils/auth'
    import { setTimeout } from 'timers';
    import { mapGetters } from 'vuex'
   
    export default {
        components: { Search,Pmd},
        computed: {
            ...mapGetters(['base_url'])
        },
        data()  {
            return  {
                form:{
                    case_id:'',
                    to_time:'',
                    yanqi_reason:'',
                },
                yanqi:false,
                lists: [],
                addSearch: [
                    { dom: 'anguan_pingcha_chaoqi', value: '',placeholder: '评查是否超期', itemId: 6, name: 'select' },
                ],
                selectOption:{
                    anguan_pingcha_chaoqi:[
                        {value: '',label: '评查是否超期'}, 
                        {value: '1',label: '评查超期'}, 
                        {value: '0',label: '评查未超期'}
                    ],
                },
                activeName: "0",
                activeName2: "",
                tabItems:[],
                tableData:[],
                badgeList:[],
                tableItems:[
                    {label: "统一受案号", prop: "case_bh", tableId:1},
                    {label: "部门受案号", prop: "bmsah", tableId:9},
                    {label: "案件类型", prop: "case_type_name", tableId:3},
                    {label: "案件名称", prop: "case_name", tableId:2},
                    {label: "案件状态", prop: "stock_status", tableId:4},
                    {label: "评查是否超期", prop: "anguan_pingcha_chaoqi", tableId:5},
                    {label: "案件描述", prop: "case_desc", overflow: true, tableId:6},                   
                    {label: "承办人", prop: "case_take_user_name", tableId:8},       
                    {label: "操作", prop: "case_take_user_name", tableId:10}, 
               

                ],
                dialogVisible:false,
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '16px',
                    color: '#2c2c2c'
                },
                seatchData: {
                    pageNum:1,
                    pageSize: 10,
                    cout_for:'yishenjie',
                },
                multipleSelection:[],
                disabled1:false,
                disabled2:false,
                tableLoading:false,
            }
        },
        filters:{
            pigeonhole(status){
                const statusList = {
                    in:"已归档",
                    in_jj_out:"已归档（交卷超期）",
                    in_rk_out:"已归档（入库超期）",
                    in_all_out:"已归档（双超期）",
                    none:"未归档",
                    none_jj_out:"未归档（交卷超期）",
                    none_rk_out:"未归档（入库超期）",
                    none_all_out:"未归档（双超期）",
                }
                return statusList[status]
            }
        },
        created(){
            this.caseTypeOrgGet()
        },
        mounted(){
            
            this.getCaseType(this.seatchData);
        },
        methods: {
            //延期按钮
            yanq(caseid){
                this.yanqi = true;
                this.form.case_id = caseid
            },
            YQSubmit(){
               this.$api.yanqitime(this.form).then(res=>{
                   if(res.code == 0){
                        this.$message({
                            message: '延期成功',
                            type: 'success'
                        });
                        this.yanqi = false;
                   }
               }).catch(error=>{
                        this.$message({
                            message: '请重新尝试',
                            type: 'warning'
                        })
               })
            },
            //跳转案件评查设置
            tzpc(){
                 this.$router.push('/setting/casetype')
             },
            //获取不能够一键评查的案件类型
            caseTypeOrgGet(){
                this.$api.caseTypeOrgGet().then(res=>{
                    // this.lists = res.data
                    let lis = res.data
                    for( var i = 0;i<lis.length; i++){
                        this.lists.push(lis[i].case_type_name)
                        
                    }
                    console.log('数组')
                    console.log(this.lists)
                })
            },
            //判断当前复选框是否可以勾选
            selectInit(row,index){
                if(row.can_easy_pingcha == 1){
                    return true
                }else{
                     return false
                }
                 
            },
            receivedAddress(data){
                Object.keys(data).map(item=> this.seatchData[item] = data[item] )
            },
            // 分类&&角标
            getCaseType(seatchData){
                this.$api.getCaseType().then(async (res)=>{
                    this.tabItems = res.data.list;
                    if(this.activeName2!=''){
                        this.activeName = this.activeName2;
                    }else{
                        this.activeName = res.data.list[0].case_type_id;
                    }
                    this.getDataList(seatchData);
                    let dataInfo = { ...seatchData }
                    const resultData = await this.$api.getCornerMarkType(dataInfo);
                    this.badgeList = resultData.data;
                    Object.keys(resultData.data).map(item=>{
                        res.data.list.map((itemChild,index)=>{
                            // console.log(item,"_"+itemChild.case_type_id)
                            if("_"+itemChild.case_type_id == item) {
                                itemChild.contNum = resultData.data[item]
                                this.$set(this.tabItems[index],index,itemChild)
                            }
                        })
                    })
                })
            },
            // 默认数据列表
            async getDataList(seatchData){
                this.tableLoading = true;
                let dataInfo = { ...seatchData }
                dataInfo ['case_type_id'] = this.activeName;
                const resultData = await this.$api.getAwaitEvaluation(dataInfo);
                if(resultData && resultData.code == '0') {
                    this.tableData = resultData.data.list;
                    this.seatchData.total = resultData.data.total;
                    this.tableLoading = false;
                }
            },
            // 导出
            openExportExcelFun(data){
                this.$nextTick(()=>{
                    // window.open(this.base_url+'/?'+exportExcelFun(data))
                })
                
            },
            comfirmSearch(data){
                this.$nextTick(()=>{ for(let key in data) { this.seatchData[key] = data[key] } })
                this.getCaseType(this.seatchData);
            },
            toggleSelection(rows,status) {
                console.log(rows,status)
                this.disabled1 = true;
                if (status) {
                    rows.forEach(row => {
                        // console.log(this.$refs.multipleTable)
                        this.$refs.multipleTable.map(item=>{
                            item.toggleAllSelection();
                        })
                    });
                } else {
                    this.$refs.multipleTable.map(item=>{
                        item.clearSelection();
                    })
                }
                setTimeout(()=>{ this.disabled1 = false; },500)
            },
           
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //确认审查
            async examination(case_id){
               const dataInfo = {case_ids:case_id}
               let resultData  = await this.$api.confirmNone(dataInfo);
               if( resultData.code == 0){
                    this.$message.success('操作成功')
                    this.getCaseType(this.seatchData)
               }else{
                    this.$message.error('请重新操作')
               }
            },
             // 确认已审查
            async confirmExamine(){
                this.disabled2 = true;
                let case_id_arr = [] 
                this.multipleSelection.map(item=>{
                    case_id_arr.push(item.case_id)
                })
                let case_ids = case_id_arr.join(",")
                const dataInfo = {case_ids:case_ids}
                let resultData  = await this.$api.confirmNone(dataInfo);
                if(resultData && resultData.code=='0'){
                    this.$message.success('操作成功')
                    this.activeName = this.activeName2;
                    this.getCaseType(this.seatchData)
                }
                setTimeout(()=>{
                    this.disabled2 = false;
                },2000)
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
            // 标签页
            handleClick(tab, event) {
                // console.log(tab, event);
                // console.log(this.activeName);
                //暂存数据
                this.activeName2 = this.activeName;
                this.getDataList(this.seatchData);
            },
            // 页面分页
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList(this.seatchData);
            },
        },
    }
</script>
<style lang="scss" scoped>
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .wait-content{
        margin: 20px;
        .search-box{
            border: 2px solid #97cfff;
            height: 82px;
            background-color: #eaf5ff;
            display: flex;
            .search-inp,button {
                margin: 23px 30px;
            }
            .search-inp{
                width: 270px;
            }
            input{
                border-radius: 8px;
                border: 1px solid #6db4ff;
            }
            button{
                width:94px;
                height: 38px;
                background-image: $gradual-color;
                color: #ffffff;
                border: none;
                font-size: 19px;
                border-radius: 8px;
            }
        }
        .head-tab{
            margin-top: 30px;
            .table-dataList{
                .highlight-btn,.ash-btn{
                    font-size: 14px;
                    color: #ffffff;
                    border: none;
                }
                .highlight-btn{
                    background-color: #6cb5ff;
                }
                .ash-btn{
                    background-color: #d1d1d1;
                }
            }
            .check-all button{
                background-image: $gradual-color; 
                color: #ffffff;
            }
            .pagination{
                margin-top: 20px;
                display: flex;
                justify-content: center;
                .page-change{
                    height: 28px;
                    line-height: 28px;
                    font-size: 13px;
                    margin: 2px 5px;
                    padding: 0px 6px;
                    background-image: $gradual-color;
                    color: #ffffff;
                    border-radius: 4px;
                    cursor: pointer;
                }
            }
            .tab-pane-position {
                position: relative;
            }
            .tab-badge-num{
                position: absolute;
                top: -8px;
            }
            .step-flex{
                display: flex;
                justify-content: center;
                overflow-y: auto;
            }
            .dialog-footer button{
                margin: 0 60px;
            }
        }
    }
    
 
    
</style>

