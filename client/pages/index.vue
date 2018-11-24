<template>
  <div class="page">
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
    <div style="height: 10px; width: 100vw"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <textarea
          class="textarea"
          placeholder="問題文をここに書きましょう"/>
      </div><!-- 終点:問題文 -->
      <div style="height: 100%; width: 20px"/><!-- 隙間 -->
      <div class="editor"><!-- エディタ -->
        <editor
          v-model="content"
          lang="ruby"
          theme="github"
          @init="editorInit"/>
      </div><!-- 終点:エディタ -->
      <div style="height: 100%; width: 20px"/><!-- 隙間 -->
      <div class="console">
        ここがコンソール
      </div><!-- 終点:コンソール -->
    </div><!-- 終点: contents -->
    <div class="footer">
      <button class="button prev is-light">戻る</button>
      <div style="width: 15px"/><!-- 隙間 -->
      <span class="question-index">3/4</span>
      <div style="width: 15px"/><!-- 隙間 -->
      <button class="button next is-primary">次へ</button>
    </div><!-- 終点: footer -->
  </div>
</template>

<script>
export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  data() {
    return {
      content: ''
    }
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
    }
  }
}
</script>

<style lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
}

.header {
  height: 8vh;
  width: 100vw;
  padding-left: 1vw;
  padding-top: 1vh;
  padding-bottom: 1vh;
  border-bottom: black 1px solid;
  display: flex;
  align-items: center;
}

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

.contents {
  height: 82vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;

  .question {
    width: 32vw;
    height: 100%;
    border-top: #999999 1px solid;
    border-right: #999999 1px solid;
    padding-left: 10px;
    padding-top: 10px;

    .textarea {
      width: 100%;
      height: 100%;
      max-height: 100vh;
    }
  }

  .editor {
    width: 32vw;
    height: 100%;
    border-top: #999999 1px solid;
    border-right: #999999 1px solid;
    border-left: #999999 1px solid;
    padding-left: 10px;
    padding-top: 10px;
  }

  .console {
    width: 32vw;
    height: 100%;
    border-top: #999999 1px solid;
    border-right: #999999 1px solid;
    border-left: #999999 1px solid;
    padding-left: 10px;
    padding-top: 10px;
  }
}

.footer {
  height: 8vh;
  width: 100vw;
  background-color: #444444;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  .question-index {
    color: white;
  }
}
</style>
