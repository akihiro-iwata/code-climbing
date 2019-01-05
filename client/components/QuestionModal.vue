<template>
  <div class="modal is-active animated slideInUp">
    <div class="modal-background"/>
    <div class="modal-content">
      <div class="header">
        <img
          src="../assets/img/logo.png"
          style="width: 66px; height: auto">
        <div style="width: 22px; height: 100%"/>
        <div class="title">Ruby プログラミング入門編</div>
      </div>
      <div style="width: 100%; height: 22px"/>
      <div class="content">
        <slot/>
      </div>
      <div style="width: 100%; height: 22px"/>
      <div class="footer">
        <button
          class="button is-info"
          @click="close">問題を解く</button>
      </div>
    </div>
    <button
      class="modal-close is-large"
      aria-label="close"
      @click="close"/>
  </div>
</template>

<script>
export default {
  name: 'QuestionModal',
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  transition: all 0.3s ease;
}

.modal-content {
  padding: 22px;
  background-color: white;
  width: 90vw;
  height: 90vh;
  .header {
    min-height: 44px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .title {
      font-size: 33px;
    }
  }

  .content {
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
  }

  .footer {
    min-height: 44px;
    width: 100%;
    background: white;

    button {
      font-size: 22px;
    }
  }
}
</style>
