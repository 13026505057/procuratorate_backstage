
<template>
    <div class="overall-content unit-content">
        <div class="search-box">
            <div>打印机设置</div>
            <el-button @click="addUnitClick('add','')">新增打印机</el-button>
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
                    <el-table-column :label="item.label"  v-for="item in tableItems" :key="item.itemId" align="center">
                        <template slot-scope="{row}">
                            <span v-if="item.itemId == 3">{{ row[item.prop] == print_id?'已绑定本机':'未绑定' }}</span>
                            <span v-else>{{ row[item.prop] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作">
                        <template slot-scope="{ row }">
                            <el-button type="primary" @click="attachClick(row)" class="ash-btn" size="small">绑定本机</el-button>
                            <!-- <el-popconfirm
                                icon="el-icon-info"
                                iconColor="red"
                                title="确定删除吗？"
                                @onConfirm = "confirmDel"
                                >
                                <el-button slot="reference" @click="delUnitClick(row.position_id)" class="highlight-btn" size="small">删除</el-button>
                            </el-popconfirm> -->
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
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="34%"
                center>
                <span>
                    <el-form ref="form" :model="stockForm" label-width="120px">
                        <el-form-item label="打印机名称">
                            <el-input v-model="stockForm.print_name"></el-input>
                        </el-form-item>
                        <el-form-item label="打印机编码">
                            <el-input v-model="stockForm.print_id"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="货架列数">
                            <el-input v-model="stockForm.lie"></el-input>
                        </el-form-item> -->
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
        </div>
    </div>
</template>
<script>
    import { mapGetters,mapActions} from 'vuex'
    // import store from '@/store'
    export default {
        computed:{
            ...mapGetters(['org_id'])
        },
        data()  {
            return  {
                tableItems:[
                    { label: "打印机名称",  prop: "print_name" ,itemId: 1 },
                    { label: "打印机编码", prop: "print_id" , itemId: 2},
                    { label: "绑定状态", prop: "print_id" , itemId: 3},
                    { label: "创建时间", prop: "create_time" , itemId: 4},
                ],
                print_id:localStorage.getItem('print_id'),
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
                    print_name: '',
                    print_id: '',
                    org_id:''
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

            }
        },
        mounted(){
            this.stockForm.org_id = this.org_id;
            this.getDataList();
        },
        methods: {
            ...mapActions({ "changPrintId": "settings/changPrintId" }),
            async getDataList(){
                const dataInfo = {pageNum:this.currentPage1,pageSize:this.pageSize,org_id:this.stockForm.org_id}
                const resultData = await this.$api.getPrintList(dataInfo);
                if(resultData&&resultData.code == 0){
                    this.tableData = resultData.data.list;
                    this.total1 = resultData.data.total;
                }
            },
            async print(){
                
                if(this.printType=='shale'){
                    
                    var dataInfo = {print_type:'shale',shale_id:this.printForm.shale_id,hang:'',lie:'',org_id:this.stockForm.org_id}
                }else{
                    var dataInfo = {print_type:'cell',shale_id:this.printForm.shale_id,hang:this.printForm.hang,lie:this.printForm.lie,org_id:this.stockForm.org_id}
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
            //点击绑定打印机
            attachClick(data){
                localStorage.setItem('print_id',data.print_id);
                this.print_id = data.print_id;
                this.changPrintId(data.print_id);
                // store.dispatch("settings/changPrintId", data.print_id)
                this.getDataList();
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
                    const resultData = await this.$api.addPrint(dataInfo);
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
