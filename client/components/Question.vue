<template>
  <div class="page">
    <Header :show-name="true"/>
    <div style="height: 10px; width: 100vw; background-color: #f0f0f0"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <QuestionEditor
          v-if="activeQuestion.text"
          :question="activeQuestion.text"
          :is-admin-mode="false"/>
        <div style="height: 10px; width: 100%"/><!-- 隙間 -->
        <button
          class="button is-info"
          @click="enterModal= true">スライドを見る</button>
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
            <div style="width: 33%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-start">
              <button
                class="button is-primary"
                @click="run">
                <span>実行</span>
              </button>
            </div>
            <div style="width: 33%; height: 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: center">
              <div
                v-if="isCorrect"
                style="border: #5ecdb3 12px solid; width: 88px; height: 88px; border-radius: 50%"/>
              <div
                v-if="isFalse"
                class="ng-mark"/>
            </div>
            <div style="width: 33%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-end">
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
        <div
          class="result">
          <div style="margin-left: 10px; font-size: 22px">実行結果</div>
          <div class="console">
            <div
              v-if="consoleOut.length !== 0"
              class="msg">
              <div
                v-for="out in consoleOut"
                :key="out.index"
                :class="{errorMsg: errorMode}"
              >{{ out }}</div>
            </div>
          </div><!-- 終点:コンソール -->
        </div>
        <div
          class="answer">
          <div style="width: 100%; height: 10px"/>
          <div style="margin-left: 10px; font-size: 22px">正解</div>
          <div style="width: 100%; height: 10px"/>
          <div v-if="activeQuestion.answers">
            <div style="max-height: 80vh; overflow-x: scroll">
              <div
                v-for="n in Object.keys(activeQuestion.answers)"
                :key="n"
                style="display: flex">
                <input
                  v-if="activeQuestion.answers"
                  :value="activeQuestion.answers[n]"
                  class="input"
                  type="text"
                  style="margin-left: 10px; margin-right: 10px; width: 95%; height: 44px; margin-bottom: 10px"
                  disabled>
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 10px"/>
        </div><!-- 終点:回答一覧 -->
      </div>

    </div><!-- 終点: contents -->
    <div
      v-if="!teacherMode"
      class="footer">
      <div style="width: 33%; height: 100%; display: flex; align-items: center;">
        <img
          style="width: 44px; cursor: pointer"
          src="../assets/img/menu.png"
          @click="goToMenu">
      </div>
      <div
        style="width: 33%; height: 100%"
        class="footer">
        <div style="min-width: 58px">
          <button
            v-if="activeQuestionIndexNumber !== 0"
            class="button prev is-light"
            @click="prev">戻る</button>
        </div>
        <div style="width: 15px"/><!-- 隙間 -->
        <span
          v-if="allQuestions[0]"
          class="question-index">
          {{ activeQuestionIndexNumber + 1 }} / {{ questionCount }}
        </span>
        <div style="width: 15px"/><!-- 隙間 -->
        <div
          v-if="allQuestions[0]"
          style="min-width: 58px">
          <button
            v-if="(activeQuestionIndexNumber + 1) !== questionCount"
            class="button next is-primary"
            @click="next">次へ</button>
        </div>
      </div>
      <div style="width: 33%; height: 100%; display: flex; justify-content: flex-end; align-items: center;">
        <div style="height: 100%; width: 40px"/>
      </div>
    </div><!-- 終点: footer -->
    <div
      v-if="teacherMode"
      class="teacher-footer">
      <div style="width: 33%; height: 100%; display: flex; align-items: center; margin-left: 20px">
        <img
          style="width: 44px; cursor: pointer"
          src="../assets/img/menu.png"
          @click="goToTeacherAnswer">
      </div>
    </div><!-- 終点: footer -->
    <QuestionModal
      v-if="enterModal && !teacherMode"
      @close="enterModal = false">
      <QuestionEditor
        v-if="activeQuestion.text"
        :question="activeQuestion.text"
        :is-admin-mode="false"/>
    </QuestionModal>
  </div>
</template>

<script>
import Header from './Header'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import QuestionEditor from './QuestionEditor'
import RubyException from '../util/RubyException'
import QuestionModal from './QuestionModal'

export default {
  components: {
    editor: require('vue2-ace-editor'),
    Header: Header,
    QuestionEditor: QuestionEditor,
    QuestionModal: QuestionModal
  },
  props: {
    challengeMode: {
      default: false,
      type: Boolean
    },
    teacherMode: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      answerContent: '',
      answers: [],
      consoleOut: [],
      returnOut: '',
      isCorrect: false,
      isFalse: false,
      isEditMode: true,
      question: '',
      inputAnswer: '',
      isResult: false,
      isAnswer: true,
      isAssistant: false,
      assistantAnswer: '',
      assistantComment: '',
      timerObject: null,
      time: 0,
      errorMode: false,
      enterModal: false,
      runMode: false
    }
  },
  computed: {
    ...mapGetters('questions', [
      'allQuestions',
      'activeChapterIndex',
      'activeQuestionIndex',
      'activeQuestion',
      'activeQuestionIndexNumber',
      'activeQuestionAnswer'
    ]),
    ...mapGetters('users', ['name']),
    questionCount() {
      return Object.keys(this.allQuestions[0].question).length
    },
    latestActiveQuestionAnswer() {
      if (this.activeQuestionAnswer.length === 0) return false
      return this.activeQuestionAnswer[this.activeQuestionAnswer.length - 1]
        .source
    }
  },
  async created() {
    Opal.load('opal')
    Opal.load('opal-parser')
    await this.changeMode({ isChallengeMode: this.challengeMode })
    await this.getAllQuestions()
    await this.getQuestion()
    await this.getAllAnswers({ name: this.name })
    this.question = this.activeQuestion.text
    this.answerContent = this.latestActiveQuestionAnswer.source
      ? this.latestActiveQuestionAnswer.source
      : this.activeQuestion.stub
    this.isCorrect = this.isCleared(this.activeQuestionAnswer)
    if (this.timerObject) this.timerClear()
    this.timer()
    if (!this.isCorrect) this.enterModal = true
  },
  methods: {
    ...mapActions('questions', [
      'getAllQuestions',
      'getQuestion',
      'nextQuestion',
      'prevQuestion',
      'changeMode',
      'getAllAnswers',
      'addAnswer'
    ]),
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
      require('brace/theme/vibrant_ink')
    },
    async run() {
      if (this.runMode) {
        return
      }
      this.runMode = true
      this.consoleOut = []
      this.errorMode = false
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
        this.errorMode = true
        let exception = new RubyException(e)
        for (let msg of exception.message()) {
          console.log(msg)
        }
      }
      console.log = console_log_org
      this.grading()
      this.runMode = false
    },
    reset() {
      this.answerContent = ''
    },
    output(msg) {
      this.consoleOut.push(msg)
    },
    isCleared(answers) {
      let clearedAnswers = answers.filter(answer => answer.correct)
      if (clearedAnswers.length === 0) return false
      this.answerContent = clearedAnswers[clearedAnswers.length - 1].source
      return true
    },
    async grading() {
      this.isCorrect = false
      this.isFalse = false
      let out = this.consoleOut.map(o => o.replace('\n', ''))
      let answers = this.activeQuestion.answers.map(a => String(a))
      if (_.isEqual(out, answers)) {
        this.isCorrect = true
      } else {
        this.isFalse = true
      }
      await this.addAnswer({
        correct: this.isCorrect,
        source: this.answerContent,
        time: this.time // FIXME
      })
      this.timerClear()
      this.timer()
    },
    async next() {
      this.clear()
      this.timerClear()
      await this.nextQuestion()
      this.question = this.activeQuestion.text
      this.answerContent = this.latestActiveQuestionAnswer.source
        ? this.latestActiveQuestionAnswer.source
        : this.activeQuestion.stub
      this.isCorrect = this.isCleared(this.activeQuestionAnswer)
      this.timer()
      if (!this.isCorrect) this.enterModal = true
    },
    async prev() {
      this.clear()
      this.timerClear()
      await this.prevQuestion()
      this.question = this.activeQuestion.text
      this.answerContent = this.latestActiveQuestionAnswer.source
        ? this.latestActiveQuestionAnswer.source
        : this.activeQuestion.stub
      this.isCorrect = this.isCleared(this.activeQuestionAnswer)
      this.timer()
      if (!this.isCorrect) this.enterModal = true
    },
    sleep(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },
    clear() {
      this.isCorrect = false
      this.isFalse = false
      this.answerContent = ''
      this.consoleOut = []
      this.stub = ''
    },
    goToMenu() {
      this.$router.push('/home')
    },
    goToTeacherAnswer() {
      this.$router.push('/teacher/answer')
    },
    timer() {
      let self = this
      this.timerObject = setInterval(function() {
        self.time = self.time + 1
      }, 1000)
    },
    timerClear() {
      clearInterval(this.timerObject)
      this.time = 0
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
    height: 75vh;
    min-height: 75vh;
    border: #999999 1px solid;
    margin-left: 0.5vw;
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
    width: 30vw;
    height: 82vh;
    margin-right: 0.5vw;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;

    .result {
      width: 30vw;
      height: 37vh;
      border: #999999 1px solid;

      .console {
        height: 100%;
        border: #999999 1px solid;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5px;
        word-wrap: break-word;
        background-color: #101010;
        overflow-y: scroll;

        .msg {
          color: #92fa4d;

          .errorMsg {
            color: red;
          }
        }
      }
    }

    .answer {
      width: 32vw;
      height: 37vh;
      overflow-y: scroll;
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

.teacher-footer {
  height: 8vh;
  width: 100vw;
  background-color: #444444;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
}

.ng-mark {
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
}

.ng-mark::before,
.ng-mark::after {
  position: absolute;
  display: block;
  content: '';
  top: 50%;
  left: 0;
  width: 100px;
  border-top: 12px solid #c00;
}
.ng-mark::before {
  transform: rotate(-45deg);
}
.ng-mark::after {
  transform: rotate(45deg);
}
</style>
