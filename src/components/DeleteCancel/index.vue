<template>
    <div>
        <!-- 案卷详情 -->
        <el-dialog v-dialogDrag title="作废原因" :visible.sync="dialogDeleteVisible" @close="resetData">
            <el-input type="textarea" v-model="submiteDataInfo.zuofei_reason" autosize
                placeholder="请输入作废原因内容"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDeleteVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDeleteBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 作废原因
            dialogDeleteVisible: false,
            submiteDataInfo: {
                exhibit_id: '',
                exhibit_status: 0,
                zuofei_reason: ''
            }
        }
    },
    methods: {
        openDeleteDialog(exhibit_id){
            this.dialogDeleteVisible = true;
            this.submiteDataInfo.exhibit_id = exhibit_id
        },
        confirmDeleteBtn(){
            this.deleteCancel(this.submiteDataInfo)
        },
        // 作废
        async deleteCancel(dataInfo){ 
            let resultData = await this.$api.editCaseData(dataInfo)
            if(resultData && resultData.code == '0') {
                this.$message.success('操作成功')
                this.dialogDeleteVisible = false;
            }
        },
        resetData(){
            this.submiteDataInfo.exhibit_id = this.submiteDataInfo.zuofei_reason = ''
        }
    }
}
</script>