<template>
  <div class="page">
    <Header :show-name="false"/>
    <div style="height: 10px; width: 100vw; background-color: #f5f5f5"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <div
          id="preview"
          class="preview markdown-body"
          v-html="preview()"/>
        <div style="height: 10px; width: 100%"/><!-- 隙間 -->
      </div><!-- 終点:問題文 -->
      <div style="height: 100%; width: 20px"/><!-- 隙間 -->
      <div class="center">
        <div class="editor"><!-- エディタ -->
          <editor
            v-model="answerContent"
            lang="ruby"
            theme="vibrant_ink"
            @init="editorInit"/>
          <div style="height: 10px; width: 100%"/><!-- 隙間 -->
          <div class="editorButton">
            <div style="width: 50%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-start">
              <button
                class="button is-primary"
                @click="run">
                <span>実行</span>
              </button>
            </div>
            <div style="width: 50%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-end">
              <button
                class="button is-danger"
                @click="reset">
                <span>リセット</span>
              </button>
            </div>
          </div>
        </div><!-- 終点:エディタ -->
      </div>
      <div style="height: 100%; width: 20px"/><!-- 隙間 -->
      <div class="right">
        <div class="console">
          <div
            v-for="out in consoleOut"
            :key="out.index">{{ out }}</div>
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
            style="margin-left: 10px; margin-right: 10px; width: 92%; height: 44px; margin-bottom: 10px"
            disabled>
          <div style="width: 100%; height: 10px"/>
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

    <div
      :class="{'is-active' : isCorrect }"
      class="modal">
      <div class="modal-background"/>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">正解です！</p>
          <button
            class="delete"
            aria-label="close"
            @click="isCorrect = false"/>
        </header>
        <footer class="modal-card-foot">
          <button class="button is-success">次の問題へ</button>
          <button class="button">やめる</button>
        </footer>
      </div>
    </div>

    <div
      :class="{'is-active' : isFalse }"
      class="modal">
      <div class="modal-background"/>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">不正解です！</p>
          <button
            class="delete"
            aria-label="close"
            @click="isFalse = false"/>
        </header>
        <footer class="modal-card-foot">
          <button class="button is-danger">再トライ</button>
        </footer>
      </div>
    </div>

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
      answerContent: '',
      answers: [],
      memo: '',
      consoleOut: [],
      returnOut: '',
      isCorrect: false,
      isFalse: false
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
    Opal.load('opal')
    Opal.load('opal-parser')
  },
  methods: {
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
      require('brace/theme/vibrant_ink')
    },
    preview() {
      let html = marked(this.memo)
      return this.renderCheckbox(html)
    },
    renderCheckbox(html) {
      return html
        .replace(/\[x\]/g, '<input type="checkbox" checked="checked">')
        .replace(/\[ \]/g, '<input type="checkbox">')
    },
    run() {
      // FIXME
      console.log('run')
      this.consoleOut = []
      const tmpjs = Opal.compile(this.answerContent)
      const console_log_org = console.log
      console.log = this.output
      this.returnOut = eval(tmpjs)
      console.log = console_log_org
    },
    reset() {
      this.answerContent = ''
    },
    output(msg) {
      this.consoleOut.push(msg)
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

.contents {
  height: 82vh;
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  background-color: #f5f5f5;

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

  .center {
    width: 32vw;
    height: 82vh;

    .editor {
      height: 67vh;
      border: #999999 1px solid;
    }

    .editorButton {
      width: 32vw;
      height: 10vh;
      display: flex;
      flex-wrap: wrap;
    }
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
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      word-wrap: break-word;
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
