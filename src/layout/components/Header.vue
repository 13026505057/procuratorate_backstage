<template>
    <div class="header">
        <div class="leftBox">
            <img src="@/assets/header/headerIcon.png" alt="" class="iconImg">
            <span class="title">档案归档考核系统</span>
        </div>
        <div class="rightBox">
            <em class="title">青岛市检察机关档案管理系统</em>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Header',
}
</script>

<style lang="scss">
    .header{
        height: 55px;
        background-image: url('../../assets/header/headerBg.png');
        line-height: 55px;
        padding: 0 50px 0 10px;
        display: flex;
        .leftBox, .rightBox{
            width: 50%;
            font-family: 'SimSun';
            font-size: 33px;
            font-weight: 600;
            .iconImg{
                width: 40px;
                height: 40px;
                vertical-align: middle;
            }
        }
        .leftBox{
            .title{
                text-shadow: 0px 3px 3px #0080ff;
                letter-spacing: 3px;
                color: #fff;
            }
        }
        .rightBox{
            text-align: right;
            .title{
                text-shadow: 0px 3px 2px #fff;
                letter-spacing: 3px;
                background-image:-webkit-linear-gradient(bottom,#0080ff,#515dbf);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;
            }
        }
    }
</style>