<template>
  <div>
    {{ isLoading }}
    <nuxt/>
    <Loading
      v-if="isLoading"
      @startLoading="startLoading"/>
  </div>
</template>

<script>
import Loading from '../components/Loading'

export default {
  components: {
    Loading: Loading
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    startLoading() {
      console.log('startLoading')
      this.isLoading = true
    }
  }
}
</script>

<style>
@import '../assets/css/global.scss';
</style>
