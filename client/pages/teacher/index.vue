<template>
  <div class="page">
    <div style="width: 100vw; height: 15vh"/>
    <div class="logo">Code Climbing</div>
    <div style="width: 100vw; height: 2vh"/>
    <div style="width: 100vw; display: flex; justify-content: center;">
      <img
        src="../../assets/img/logo.png"
        style="width: 20vw; height: 100%">
    </div>
    <div style="width: 100vw; height: 0.5vh"/>
    <div class="field">
      <div class="control">
        <input
          v-model="id"
          class="input is-large"
          type="text"
          placeholder="教員ID">
      </div>
    </div>
    <div style="width: 100vw; height: 0.5vh"/>
    <div style="width: 100vw; display: flex; justify-content: center">
      <button
        class="button is-primary is-rounded"
        style="height: 6vh; width: 40vw"
        @click="doLogin">ログイン</button>
    </div>
    <div style="width: 100vw; height: 15vh"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Index',
  data() {
    return {
      id: ''
    }
  },
  created() {
    this.id = 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c'
  },
  methods: {
    ...mapActions('teachers', ['login']),
    async doLogin() {
      try {
        await this.login(this.id)
        this.$router.push('/teacher/question')
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  .logo {
    width: 100vw;
    text-align: center;
    font-size: 44px;
    font-family: adelle, serif;
    font-style: normal;
    font-weight: bold;
  }

  input {
    width: 40vw;
  }
}
</style>
