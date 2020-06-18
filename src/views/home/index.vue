<template>
  <div class="homePage">
    <Search :addSearch="addSearch" :selectOption="selectOption" :resetData="false" @comfirmSearch="comfirmSearch"/>
    123123123312
    <svg class="icon iconcccc" aria-hidden="true">
      <use xlink:href="#iconcaihongSVG"></use>
    </svg>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Search from '@/components/Search'

export default {
  name: 'Dashboard',
  components: { Search },
  data() {
    return {
      addSearch: [
        { dom: 'eac11', value: '',placeholder: '请选择年份', itemId: 5, name: 'input' },
        { dom: 'eac11123', value: '',placeholder: '请选择年份', itemId: 6, name: 'select' },
      ],
      selectOption: {
        
      }
    }
  },
  computed: {
    ...mapGetters(['roles'])
  },
  methods: {
    comfirmSearch(data){
      console.log(data,11111)
    }
  }
}
</script>

<style lang="scss">
  .homePage{
    padding: 20px;
  }
</style>