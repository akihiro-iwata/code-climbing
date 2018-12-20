<template>
  <div class="header">
    <div style="width: 50vw; height: 100%; display: flex; justify-content: flex-start; margin-left: 10px; align-items: center">
      <img
        src="../assets/img/logo.png"
        style="width: auto; height: 50px">
      <div style="width: 15px"/><!-- 隙間 -->
      <span class="logo">Code Climbing</span>
    </div>
    <div style="width: 15px"/><!-- 隙間 -->
    <div style="width: 50vw; height: 100%; display: flex; justify-content: flex-end; margin-right: 40px; align-items: center">
      <span class="nameLabel">{{ name }}</span>
    </div>
  </div><!-- 終点: header -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    showName: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters('users', ['name'])
  }
}
</script>

<style scoped lang="scss">
.header {
  height: 8vh;
  width: 100vw;
  padding-left: 1vw;
  padding-top: 1vh;
  padding-bottom: 1vh;
  border-bottom: black 1px solid;
  display: flex;
  align-items: center;

  .logo {
    font-size: 28px;
    font-family: adelle, serif;
    font-style: normal;
    font-weight: bold;
  }

  .nameLabel {
    font-size: 20px;
    font-family: 'Noto Sans JP', sans-serif;
  }
}
</style>
