<template>
  <div class="page">
    <Header :show-name="false"/>
    <div style="height: 10px; width: 100vw; background-color: #f0f0f0"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <QuestionEditor
          v-if="activeQuestion.text"
          :question="activeQuestion.text"
          :is-admin-mode="false"
          @save="save"/>
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
            <div v-if="consoleOut.length !== 0">
              <div
                v-for="out in consoleOut"
                :key="out.index">{{ out }}</div>
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
    <div class="footer">
      <div style="width: 33%; height: 100%; display: flex; align-items: center">
        <img
          style="width: 44px  "
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
  </div>
</template>

<script>
import Header from '../components/Header'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import QuestionEditor from '../components/QuestionEditor'

export default {
  components: {
    editor: require('vue2-ace-editor'),
    Header: Header,
    QuestionEditor: QuestionEditor
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
      assistantComment: ''
    }
  },
  computed: {
    ...mapGetters('questions', [
      'allQuestions',
      'activeChapterIndex',
      'activeQuestionIndex',
      'activeQuestion',
      'activeQuestionIndexNumber'
    ]),
    ...mapGetters('users', ['name']),
    questionCount() {
      return Object.keys(this.allQuestions[0].question).length - 1
    }
  },
  mounted() {
    this.question = this.activeQuestion.text
    if (this.activeQuestion.stub) {
      this.stub = this.activeQuestion.stub
    }
  },
  async created() {
    Opal.load('opal')
    Opal.load('opal-parser')
    await this.getAllQuestions()
    console.log(
      'created: this.activeQuestionIndexNumber',
      this.activeQuestionIndexNumber
    )
    await this.getQuestion({
      chapterIndex: this.activeChapterIndex,
      questionIndexNumber: this.activeQuestionIndexNumber
    })
    await this.getAnswer({
      name: this.name,
      chapterIndex: this.activeChapterIndex,
      questionIndexNumber: this.activeQuestionIndexNumber
    })
    this.question = this.activeQuestion.text
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
      'prevQuestion',
      'updateQuestion',
      'addAnswerToQuestion',
      'removeAnswerFromQuestion',
      'addAnswerAssistant',
      'removeAnswerAssistant',
      'addQuestion',
      'removeQuestion'
    ]),
    ...mapActions('answers', ['getAnswer']),
    editorInit() {
      require('brace/ext/language_tools')
      require('brace/mode/ruby')
      require('brace/theme/github')
      require('brace/theme/vibrant_ink')
    },
    async run() {
      // FIXME
      console.log('this.answerContent', JSON.stringify(this.answerContent))
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
      this.isCorrect = false
      this.isFalse = false
      let out = this.consoleOut.map(o => o.replace('\n', ''))
      let answers = this.activeQuestion.answers.map(a => String(a))
      if (_.isEqual(out, answers)) {
        this.isCorrect = true
      } else {
        this.isFalse = true
      }
    },
    async next() {
      this.clear()
      await this.nextQuestion()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      this.question = this.activeQuestion.text
    },
    async prev() {
      this.clear()
      await this.prevQuestion()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      this.question = this.activeQuestion.text
      console.log(
        'prev: this.activeQuestionIndexNumber',
        this.activeQuestionIndexNumber
      )
      console.log('prev: ', this.activeQuestion)
    },
    sleep(time) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, time)
      })
    },
    async stubSave() {
      let params = {
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        text: this.question,
        answers: this.activeQuestion.answers,
        functionName: this.activeQuestion['function-name'],
        stub: this.stub
      }
      await this.updateQuestion(params)
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndex
      })
    },
    async save(newQuestion) {
      let params = {
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        text: newQuestion,
        answers: this.activeQuestion.answers,
        functionName: this.activeQuestion['function-name'],
        stub: this.stub
      }
      await this.updateQuestion(params)
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
    },
    async addAnswer() {
      if (!this.inputAnswer) return ''
      let answers = Object.assign([], this.activeQuestion.answers)
      answers.push(this.inputAnswer)
      let params = {
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        answers: answers
      }
      await this.addAnswerToQuestion(params)
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      this.inputAnswer = ''
    },
    async deleteAnswer(answerIndex) {
      await this.removeAnswerFromQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        answerIndex: answerIndex
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      console.log(
        'this.activeQuestionIndexNumber:',
        this.activeQuestionIndexNumber
      )
      console.log('this.activeQuestion', this.activeQuestion)
      this.inputAnswer = ''
    },
    async addAssistant() {
      if (!this.assistantAnswer || !this.assistantComment) return ''
      await this.addAnswerAssistant({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        assistants: this.assistantAnswer,
        comment: this.assistantComment
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      this.assistantAnswer = ''
      this.assistantComment = ''
    },
    async removeAssistant(key) {
      await this.removeAnswerAssistant({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber,
        key: key
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
    },
    clear() {
      this.isCorrect = false
      this.isFalse = false
      this.answerContent = ''
      this.stub = ''
    },
    async add() {
      await this.addQuestion({
        chapterIndex: this.activeChapterIndex
      })
      await this.getAllQuestions()
      await this.next()
    },
    async remove() {
      await this.removeQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndexNumber: this.activeQuestionIndexNumber
      })
      await this.getAllQuestions()
      await this.prev()
    },
    goToMenu() {
      this.$router.push('/home')
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
        color: #92fa4d;
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
