<template>
  <div class="page">
    <div style="width: 100vw; height: 15vh"/>
    <div class="logo">Code Climbing</div>
    <div style="width: 100vw; height: 2vh"/>
    <div style="width: 100vw; display: flex; justify-content: center;">
      <img
        src="../assets/img/logo.png"
        style="width: 20vw; height: 100%">
    </div>
    <div style="width: 100vw; height: 0.5vh"/>
    <div class="field">
      <div class="control">
        <input
          v-model="name"
          class="input is-large"
          type="text"
          placeholder="氏名"
          @keyup.enter="doLogin"
          @keypress="setCanDoLogin">
      </div>
    </div>
    <div style="width: 100vw; height: 0.5vh"/>
    <div style="width: 100vw; display: flex; justify-content: center">
      <button
        :disabled="name.length === 0"
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
      name: '',
      canDoLogin: false
    }
  },
  methods: {
    ...mapActions('users', ['login']),
    async doLogin() {
      if (!this.name || !this.canDoLogin) return
      try {
        await this.login(this.name)
        this.$router.push('/home')
      } catch (error) {
        console.error(error)
      }
    },
    setCanDoLogin() {
      this.canDoLogin = true
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
