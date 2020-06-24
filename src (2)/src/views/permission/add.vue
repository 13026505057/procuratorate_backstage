<template>
  <div class="addPage">
    
  </div>
</template>

<script>

export default {
  name: 'addPage',
  mounted(){
    this.getTableList();
  },
  methods: {
    // 获取列表
    async getTableList(){
      const resultData = await this.$api.getRoutes()
      console.log(resultData)
    }
  }
}
</script>
