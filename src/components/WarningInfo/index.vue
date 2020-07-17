<template>
    <div>
        <!-- 警告提示 -->
        <el-dialog v-dialogDrag title="温馨提示" :visible.sync="dialogWarningVisible">
            
            <div class="warningInfo" v-if="warningType == 'readyItem'">
                原“预入库”页面，已改为当前“预收卷”。
                <li>您可以在当前页面，接收2019年及以后不规范办结（不符合归档条件的）但点击了办结按钮的案件的卷宗，卷宗入库后会被标记“不规范办结”。</li>
                    <!-- 可在“<el-link type="primary" @click="skipDetail('已归档案件 - CompletedArchives')">已归档案件</el-link>”菜单下查询“不规范办结”的案件信息。 -->
                <li>原预入库的卷宗信息，保留在“<el-link type="primary" @click="skipDetail('预入库绑定 - BindReadyItem')">预入库绑定</el-link>”
                    菜单下，您依然可以对预入库的卷宗进行绑定案件等其他操作。</li>
                <li>如依然无法查询到案件信息。请到“<el-link type="primary" @click="skipDetail('案件办结情况查询 - FinishStatus')">案件办结情况查询</el-link>”
                    菜单下，确认案件是否点击办结按钮。</li>
                <li>如以上几点均无法解决，请与管理人员联系。</li>
            </div>
            <div class="warningInfo" v-if="warningType == 'addItem'">
                该卷没有找到匹配的办结案卡信息。可能原因如下：
                <li>办结不规范，可到“<el-link type="primary" @click="skipDetail('不规范办结 - UnStandard')">不规范办结</el-link>”菜单下查询确认;</li>
                <li>案件未办结，可到“<el-link type="primary" @click="skipDetail('案件办结情况查询 - FinishStatus')">案件办结情况查询</el-link>”菜单
                下查询确认。</li>
                <li>查询条件输入错误，请检查输入是否有错别字，输入的编号是否正确。</li>
                <li>如以上几点均无法解决，请与管理人员联系。</li>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props: {
        warningType: [String]
    },
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