<template>
  <div class="page">
    <Header :show-name="false"/>
    <div style="height: 10px; width: 100vw; background-color: #f0f0f0"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <div
          id="preview"
          class="preview markdown-body"
          v-html="preview"/>
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
        <div style="margin-left: 10px; font-size: 22px">実行結果</div>
        <div class="console">
          <div v-if="consoleOut.length !== 0">
            <div
              v-for="out in consoleOut"
              :key="out.index">{{ out }}</div>
          </div>
        </div><!-- 終点:コンソール -->
        <div class="answer">
          <div style="width: 100%; height: 10px"/>
          <div style="margin-left: 10px; font-size: 22px">正解</div>
          <div style="width: 100%; height: 10px"/>
          <div
            v-if="activeQuestion.answers"
            style="height: 24vh">
            <div style="overflow-x: scroll; width: 100%; height: 100%; background-color: #101010; color: #92fa4d; padding-left: 10px; padding-top: 10px">
              <div
                v-for="n in Object.keys(activeQuestion.answers)"
                :key="n">
                {{ activeQuestion.answers[n] }}
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 10px"/>
        </div><!-- 終点:コンソール -->
      </div>

    </div><!-- 終点: contents -->
    <div class="footer">
      <div style="min-width: 58px">
        <button
          v-if="activeQuestionIndex !== 0"
          class="button prev is-light"
          @click="prev">戻る</button>
      </div>
      <div style="width: 15px"/><!-- 隙間 -->
      <span
        v-if="allQuestions[0]"
        class="question-index">
        {{ activeQuestionIndex + 1 }} / {{ allQuestions[0].question.length }}
      </span>
      <div style="width: 15px"/><!-- 隙間 -->
      <div
        v-if="allQuestions[0]"
        style="min-width: 58px">
        <button
          v-if="activeQuestionIndex !== (allQuestions[0].question.length - 1)"
          class="button next is-primary"
          @click="next">次へ</button>
      </div>
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
          <button
            class="button is-success"
            @click="next">次の問題へ</button>
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
import { mapActions, mapGetters } from 'Vuex'
import _ from 'lodash'

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
  computed: {
    ...mapGetters('questions', [
      'allQuestions',
      'activeChapterIndex',
      'activeQuestionIndex',
      'activeQuestion'
    ]),
    ...mapGetters('users', ['name']),
    preview() {
      if (!this.activeQuestion || !this.activeQuestion.text) return ''
      return this.renderCheckbox(marked(this.activeQuestion.text))
    }
  },
  watch: {
    async activeQuestionIndex(newVal) {
      this.consoleOut = []
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: newVal
      })
      await this.getAnswer({
        name: this.name,
        chapterIndex: this.activeChapterIndex,
        questionIndex: newVal
      })
      console.log('activeQuestion', this.activeQuestion)
      this.answerContent = this.activeQuestion.stub
    }
  },
  mounted() {
    marked.setOptions({
      gfm: true,
      breaks: true,
      langPrefix: '',
      fontSize: '20pt',
      highlight: function(code, langAndTitle, callback) {
        const lang = langAndTitle ? langAndTitle.split(':')[0] : ''
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  },
  async created() {
    Opal.load('opal')
    Opal.load('opal-parser')
    await this.getAllQuestions()
    await this.getQuestion({
      chapterIndex: this.activeChapterIndex,
      questionIndex: this.activeQuestionIndex
    })
    await this.getAnswer({
      name: this.name,
      chapterIndex: this.activeChapterIndex,
      questionIndex: this.activeQuestionIndex
    })
    this.memo = this.activeQuestion.text
    console.log('activeQuestion', this.activeQuestion)
    this.answerContent = this.activeQuestion.stub
  },
  methods: {
    ...mapActions('questions', [
      'getAllQuestions',
      'updateChapterIndex',
      'updateQuestionIndex',
      'getQuestion',
      'nextQuestion',
      'prevQuestion'
    ]),
    ...mapActions('answers', ['getAnswer']),
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
      require('brace/theme/vibrant_ink')
    },
    renderCheckbox(html) {
      return html
        .replace(/\[x\]/g, '<input type="checkbox" checked="checked">')
        .replace(/\[ \]/g, '<input type="checkbox">')
    },
    async run() {
      // FIXME
      this.consoleOut = []
      await this.sleep(100)
      const console_log_org = console.log
      console.log = this.output
      let code = this.answerContent
      if (this.activeQuestion['function-name']) {
        for (let arg of this.activeQuestion.arguments) {
          code += `\n
        ${this.activeQuestion['function-name']}(${Object.values(arg).join()})`
        }
      }
      try {
        const tmpjs = Opal.compile(code)
        this.returnOut = eval(tmpjs)
      } catch (e) {
        console.log(e)
      }
      console.log = console_log_org
      this.grading()
    },
    reset() {
      this.answerContent = ''
    },
    output(msg) {
      this.consoleOut.push(msg)
    },
    grading() {
      let out = this.consoleOut.map(o => o.replace('\n', ''))
      let answers = this.activeQuestion.answers.map(a => String(a))
      if (_.isEqual(out, answers)) {
        this.isCorrect = true
      }
    },
    async next() {
      this.isCorrect = false
      this.isFalse = false
      await this.nextQuestion()
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
      })
      this.question = this.activeQuestion.text
    },
    async prev() {
      this.isCorrect = false
      this.isFalse = false
      await this.prevQuestion()
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
      })
      this.question = this.activeQuestion.text
    },
    sleep(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
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
  background-color: #f0f0f0;

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
      height: 40vh;
      border: #999999 1px solid;
      padding-left: 10px;
      padding-right: 10px;
      padding-top: 5px;
      word-wrap: break-word;
      background-color: #101010;
      color: #92fa4d;
    }

    .answer {
      width: 32vw;
      height: 35%;
      border: #999999 1px solid;
      margin-top: 10px;
      background-color: #f0f0f0;
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
