<template>
    <div>
        <!-- 警告提示 -->
        <el-dialog v-dialogDrag title="温馨提示" :visible.sync="dialogWarningVisible">
            <div class="warningInfo">
                该卷没有找到匹配的办结案卡信息。可能原因如下：
                <li>办结不规范，可到“<el-link type="primary" @click="skipDetail('不规范办结 - UnStandard')">不规范办结</el-link>”菜单下查询确认;</li>
                <li>案件未办结，可到“<el-link type="primary" @click="skipDetail('案件办结情况查询 - FinishStatus')">案件办结情况查询</el-link>”菜单
                下查询确认。</li>
                <li>查询条件输入错误，请检查输入是否有错别字，输入的编号是否正确。</li>
                <li>如以下几点均无法解决，请与管理人员联系。</li>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            // 警告提示
            dialogWarningVisible: false,
        }
    },
    methods: {
        openWarningDialog(){
            this.dialogWarningVisible = true;
        },
        skipDetail(route){
            console.log(route)
            this.$router.push({ name: route })
        }
    }
}
</script>
<style lang="scss" scoped>
    .warningInfo{
        li{
            list-style: decimal;
        }
    }
</style>