<template>
  <div class="header">
    <img
      src="../assets/img/logo.png"
      style="width: auto; height: 50px">
    <div style="width: 15px"/><!-- 隙間 -->
    <span class="logo">Code Climbing</span>
    <div style="width: 50vw"/><!-- 隙間 -->
    <span class="nameLabel">名前</span>
    <div style="width: 15px"/><!-- 隙間 -->
    <input
      class="nameBox"
      type="text"
      placeholder="名前を入力してください">
  </div><!-- 終点: header -->
</template>

<script>
</script>

<style scoped>
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
    font-family: 'Noto Sans JP', sans-serif;
  }

  .nameBox {
    font-family: 'Noto Sans JP', sans-serif;
    width: 20vw;
  }
}
</style>
