
<template>
    <div class="overall-content unit-content">
        <div class="search-box">
            <div>存储设备列表</div>
            <el-button @click="addUnitClick('add','')">新增设备</el-button>
            <el-button @click="updateStorageData()">更换存储位置</el-button>
        </div>
        <div class="table-list">
            <div class="table-dataList" >
                <el-table
                    :data="tableData"
                    :header-cell-style="headerRowStyle"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        label="序号"
                        width="60"
                        type="index">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        v-for="tableItem in tableItems"
                        :prop="tableItem.prop"
                        :label="tableItem.label"
                        :key="tableItem.label"
                        >
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="{ row }">
                            <el-button @click="printClick(row)" class="ash-btn" size="small">条码打印</el-button>
                            <el-button @click="detail(row)" class="ash-btn" size="small">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currentPage1"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total1">
                </el-pagination>
            </div>
            <el-dialog v-dialogDrag
                title="详情"
                :visible.sync="detailrow"
                width="40%"
                center>
                <el-table
                    :data="tabaledetail"
                    style="width: 100%">
                    <el-table-column
                        prop="cell_name"
                        label="格子名称"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="cell_id"
                        label="格子条码"
                        align="center">
                    </el-table-column>
                </el-table>               
                <span slot="footer" class="dialog-footer">      
                    <el-button type="primary" @click="detailrow = false">关 闭</el-button>
                </span>
            </el-dialog>
             <el-dialog v-dialogDrag
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="34%"
                center>
                <span>
                    <el-form ref="form" :model="stockForm" label-width="80px">
                        <el-form-item label="货架名称">
                            <el-input v-model="stockForm.shale_name"></el-input>
                        </el-form-item>
                        <el-form-item label="货架行数">
                            <el-input v-model="stockForm.hang"></el-input>
                        </el-form-item>
                        <el-form-item label="货架列数">
                            <el-input v-model="stockForm.lie"></el-input>
                        </el-form-item>
                    </el-form>  
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-popconfirm
                        :title="popconfirmTitle"
                        @onConfirm="confirmClick"
                        >
                        <!-- <el-button>删除</el-button> -->
                        <el-button slot="reference" type="primary" @click="confirmAddUnit">确 定</el-button>
                    </el-popconfirm>
                    <!-- <el-button type="primary" @click="confirmAddUnit">确 定</el-button> -->
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <el-dialog v-dialogDrag
                :title="printTitle"
                :visible.sync="printVisible"
                width="34%"
                center>
                <span>
                    <el-form ref="form" :model="printForm" label-width="80px">
                        <el-form-item label="打印选项">
                            <el-radio v-model="printType" label="shale">全部打印</el-radio>
                            <el-radio v-model="printType" label="cell">单项打印</el-radio>
                        </el-form-item>
                        
                        <el-form-item v-if="printType=='cell'?true:false" label="设备行数">
                            <el-input v-model="printForm.hang"></el-input>
                        </el-form-item>
                        <el-form-item v-if="printType=='cell'?true:false" label="设备列数">
                            <el-input v-model="printForm.lie"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="货架名称">
                            <el-input v-model="stockForm.shale_name"></el-input>
                        </el-form-item>
                        <el-form-item label="货架行数">
                            <el-input v-model="stockForm.hang"></el-input>
                        </el-form-item>
                        <el-form-item label="货架列数">
                            <el-input v-model="stockForm.lie"></el-input>
                        </el-form-item> -->
                    </el-form>  
                </span>
                <span slot="footer" class="dialog-footer">
                    <el-button slot="reference" type="primary" @click="confirmPrint">确 定</el-button>
                    <!-- <el-button type="primary" @click="confirmAddUnit">确 定</el-button> -->
                    <el-button type="primary" @click="printVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
            <!-- 新增案件 -->
            <el-dialog v-dialogDrag title="更换存储位置" :visible.sync="showModel.dialogLocationVisible">
                <el-form :model="submitDataInfo" :rules="rules_update" ref="update" label-width="20%" class="demo-ruleForm">
                    <template v-for="item in eachDataInfoList">
                        <el-form-item :label="item.captionTitle" :prop="item.dom">
                            <el-cascader v-model="submitDataInfo[item.dom]" :options="showModel[item.dom]" :placeholder="item.placeholder"
                                 v-if="item.type == 'cascader'" :props="{ emitPath: false }" clearable></el-cascader>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-button @click="showModel.dialogLocationVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmUpdateLocation('update')">确 定</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    
    export default {
        computed:{
            ...mapGetters(['org_id','print_id'])
        },
        data()  {
            return  {
                tabaledetail:[],
                detailrow:false,
                tableItems:[
                    { label: "货架名称",  prop: "shale_name" },
                    { label: "货架行数", prop: "hang" ,},
                    { label: "货架列数", prop: "lie" ,},
                    { label: "创建时间", prop: "create_time" ,},
                ],
                tableData: [],
                headStyle:{
                    backgroundColor: '#eaf5ff',
                    borderTop: '1px solid #97cfff',
                    borderBottom: '1px solid #97cfff',
                    fontSize: '18px',
                    color: '#2c2c2c'
                },
                printTitle:'打印条码',
                currentPage1:1,
                total1:1,
                pageSize:10,
                dialogVisible:false,
                printVisible:false,
                dialogTitle:'',
                stockForm:{
                    shale_name: '',
                    hang: '',
                    lie:''
                },
                printType:'shale',
                printForm:{
                    shale_id:'',
                    hang: '',
                    lie:''
                },
                type:'',
                position_id:'',
                popconfirmTitle:'',
                // 更换存储位置
                showModel: {
                    dialogLocationVisible: false,
                    old_cell_id: [],
                    new_cell_id: []
                },
                submitDataInfo: {
                    old_cell_id: '',
                    new_cell_id: ''
                },
                eachDataInfoList: [
                    { captionTitle: '更换前的格子', placeholder: '请选择更换前的格子', dom: 'old_cell_id', itemId: 1, type: 'cascader' },
                    { captionTitle: '更换后的格子', placeholder: '请选择更换后的柜子', dom: 'new_cell_id', itemId: 2, type: 'cascader' },
                ],
                rules_update: {
                    old_cell_id: [
                        { required: true, message: '请选择更换前的格子', trigger: 'blur' }
                    ],
                    new_cell_id: [
                        { required: true, message: '请选择更换后的柜子', trigger: 'blur' }
                    ],
                },
            }
        },
        mounted(){
            this.stockForm.org_id = this.org_id;
            this.getDataList();
            this.getcc();
        },
        methods: {
            detail(row){
                 this.detailrow = true
                 this.tabaledetail = row.cellList
            },
            updateStorageData(){
                this.showModel.dialogLocationVisible = true
            },
            async getcc(){
                const resultData = await this.$api.updatecc()
                 if(resultData&&resultData.code == 0){
                    const location = () =>{
                        let data = []
                        resultData.data.map(item=>{
                            let dataCell = []
                            item.cellList.map(itemChild=>{
                                dataCell.push({value:itemChild.cell_id,label:itemChild.cell_name_and_id})
                            })
                            data.push({
                                value: item.shale_id,
                                label: item.shale_name,
                                children: dataCell
                            })
                        })
                        return data
                    }
                    this.showModel.old_cell_id = this.showModel.new_cell_id = location()
                 }
            },
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize,org_id:this.stockForm.org_id}
                const resultData = await this.$api.getStock(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                //     const location = () =>{
                //         let data = []
                //         resultData.data.list.map(item=>{
                //             let dataCell = []
                //             item.cellList.map(itemChild=>{
                //                 dataCell.push({value:itemChild.cell_id,label:itemChild.cell_name+itemChild.cell_name_and_id})
                //             })
                //             data.push({
                //                 value: item.shale_id,
                //                 label: item.shale_name,
                //                 children: dataCell
                //             })
                //         })
                //         return data
                //     }
                //     this.showModel.old_cell_id = this.showModel.new_cell_id = location()
                 }
            },
            async confirmUpdateLocation(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let resultData = await this.$api.updateOldCellToNewCell(this.submitDataInfo)
                        if(resultData && resultData.code =='0') {
                            this.showModel.dialogLocationVisible = false;
                            this.$message.success('更新成功')
                        }
                    } else return false;
                })
            },
            async print(){
                if(this.printType=='shale'){
                    
                    var dataInfo = {print_type:'shale',shale_id:this.printForm.shale_id,hang:'',lie:'',org_id:this.stockForm.org_id,print_id:this.print_id}
                }else{
                    var dataInfo = {print_type:'cell',shale_id:this.printForm.shale_id,hang:this.printForm.hang,lie:this.printForm.lie,org_id:this.stockForm.org_id,print_id:this.print_id}
                }
                
                const resultData = await this.$api.printCode(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.$message({
                        message: '打印请求发送成功',
                        type: 'success'
                    });
                    this.printVisible = false;
                    // this.tableData = resultData.data.list;
                    // this.total1 = resultData.data.total;
                }
            },
            //确定打印
            confirmPrint(){
                this.print();
            },
            headerRowStyle({row, rowIndex}){ 
                return this.headStyle
            },
           
            handleCurrentChange1(val) {
                console.log(`当前页: ${val}`);
                this.getDataList();
            },
            // 新增
            addUnitClick(type,row_position_id){
                this.dialogVisible = true;
                this.type = type;
                this.position_id = row_position_id.position_id;
                if(type == "add"){
                    this.dialogTitle = "新增设备";
                    this.stockForm = {
                        position_name :'',
                    }
                }
            },
            //点击打印条码
            printClick(data){
                this.printVisible = true;
                this.printForm.shale_id = data.shale_id;
            },
            // 新增&&修改
            async confirmAddUnit(){
                if(this.type == "add"){
                    this.popconfirmTitle = "确定新增吗"
                }else{
                    this.popconfirmTitle = "确定修改吗"
                }
                
            },
            async confirmClick(){
                const dataInfo = { ...this.stockForm }
                if(this.type == "add"){
                    const resultData = await this.$api.addStock(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }else{
                    dataInfo['position_id'] = this.position_id;
                    console.log(dataInfo)
                    const resultData = await this.$api.updatePosition(dataInfo);
                    if(resultData&&resultData.code == 0){
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                    }
                }
                this.getDataList();
            },
            // 删除
            delUnitClick(position_id){
                this.position_id = position_id
            },
            async confirmDel(){
                const dataInfo = {shale_id: this.position_id}
                const resultData = await this.$api.deleteStock(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }
                this.getDataList();
            },
        }

    }
</script>
<style lang="scss" scoped>
    $gradual-color: linear-gradient(to bottom right , #6db4ff, #47ccff);
    .unit-content{
        margin: 20px;
        
        .search-box{
            border: 2px solid #97cfff;
            height: 70px;
            padding: 15px 0;
            background-color: #eaf5ff;
            display: flex;
            div,button{
                margin-left: 30px;
            }
            div{
               height: 38px;
               line-height: 38px; 
            }
            button{
                // width:94px;
                height: 38px;
                background-image: $gradual-color;
                color: #ffffff;
                border: none;
                font-size: 17px;
                border-radius: 8px;
            }
        }
        .table-list{
            .table-dataList{
                margin-top: 20px;
                .highlight-btn,.ash-btn{
                    font-size: 14px;
                }
                .highlight-btn{
                    background-color: #6cb5ff;
                    color: #ffffff;
                    border: none;
                }
                .ash-btn{
                    // background-color: #d1d1d1;
                }
            }
            
            .pagination{
                margin-top: 30px;
                display: flex;
                justify-content: center;
            }
        
        }
            
    }
</style>
