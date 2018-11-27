<template>
  <div class="page">
    <Header :show-name="false"/>
    <div style="height: 10px; width: 100vw"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <textarea
          v-if="!isPreview"
          v-model="memo"
          class="textarea markdown"
          placeholder="問題文をここに書きましょう"/>
        <div
          v-if="isPreview"
          id="preview"
          class="preview markdown-body"
          v-html="preview()"/>
        <div style="height: 10px; width: 100%"/><!-- 隙間 -->
        <button
          class="button is-info"
          @click="isPreview = !isPreview">
          <span v-if="!isPreview">プレビュー</span>
          <span v-if="isPreview">編集</span>
        </button>
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
      <div class="right">
        <div class="console">
          ここがコンソール
        </div><!-- 終点:コンソール -->
        <div class="answer">
          <div style="width: 100%; height: 10px"/>
          <div style="margin-left: 10px; font-size: 22px">正解</div>
          <div style="width: 100%; height: 10px"/>
          <input
            v-for="answer in answers"
            :key="answer.index"
            :value="answer"
            class="input"
            type="text"
            style="margin-left: 10px; margin-right: 10px; width: 92%; height: 44px; margin-bottom: 10px">
          <input
            v-model="inputAnswer"
            class="input"
            type="text"
            placeholder="e.g) Hello World"
            style="margin-left: 10px; margin-right: 10px; width: 92%; height: 44px; margin-bottom: 10px">
          <div style="width: 100%; height: 10px"/>
          <span
            class="icon"
            style="width: 100%; height: 44px; font-size: 36px">
            <i
              class="fas fa-plus-circle"
              @click="addAnswer"
            />
          </span>
        </div><!-- 終点:コンソール -->
      </div>

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
import marked from 'marked'
import hljs from 'highlightjs'
import Header from '../components/Header'

export default {
  components: {
    editor: require('vue2-ace-editor'),
    Header: Header
  },
  data() {
    return {
      content: '',
      answers: [],
      inputAnswer: '',
      isPreview: false,
      memo: ''
    }
  },
  created() {
    marked.setOptions({
      gfm: true,
      breaks: true,
      langPrefix: '',
      highlight: function(code, langAndTitle, callback) {
        const lang = langAndTitle ? langAndTitle.split(':')[0] : ''
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
    },
    addAnswer() {
      this.answers.push(this.inputAnswer)
      this.inputAnswer = ''
    },
    preview() {
      let html = marked(this.memo)
      return this.renderCheckbox(html)
    },
    renderCheckbox(html) {
      return html
        .replace(/\[x\]/g, '<input type="checkbox" checked="checked">')
        .replace(/\[ \]/g, '<input type="checkbox">')
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
  font-family: 'Noto Sans JP', sans-serif;
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
      height: 72vh;
    }

    .preview {
      min-height: 72vh;
    }
  }

  .editor {
    width: 32vw;
    height: 100%;
    border-top: #999999 1px solid;
    border-right: #999999 1px solid;
    border-left: #999999 1px solid;
  }

  .right {
    width: 32vw;
    height: 100%;
    border: #999999 1px solid;
    display: flex;
    flex-wrap: wrap;

    .console {
      width: 32vw;
      height: 50%;
      border: #999999 1px solid;
    }

    .answer {
      width: 32vw;
      height: 50%;
      border: #999999 1px solid;
      margin-top: 10px;
      background-color: #f5f5f5;
    }
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
