<template>
  <div class="page">
    <Header :show-name="true"/>
    <div class="contents">
      <div
        class="menu-panel"
        @click="goToCreate">
        <div class="content">
          <div class="thumbnail">
            <img src="../../assets/img/tools.png">
          </div>
          <div style="width: 100%; height: 10px"/>
          <span class="label">問題を作成する</span>
        </div>
      </div>
      <div style="width: 22px; height: 100%"/>
      <div
        class="menu-panel"
        @click="goToAnswer">
        <div class="content">
          <div class="thumbnail">
            <img src="../../assets/img/school-bus.png">
          </div>
          <div style="width: 100%; height: 10px"/>
          <span class="label">回答状況を確認する</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'

export default {
  components: {
    Header: Header
  },
  methods: {
    goToAnswer() {
      this.$router.push('/teacher/answer')
    },
    goToCreate() {
      this.$router.push('/teacher/question')
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;

  .contents {
    height: 92vh;
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-color: white;

    .menu-panel {
      width: 300px;
      height: 300px;
      border: #999999 2px solid;
      border-radius: 6%;
      background-color: #f0f0f0;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      .content {
        width: 200px;
        height: 200px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        .thumbnail {
          width: 175px;
          height: 175px;

          img {
            width: 100%;
            height: 100%;
          }
        }
        .label {
          font-size: 22px;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
