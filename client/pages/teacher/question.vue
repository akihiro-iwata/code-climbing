<template>
  <div class="page">
    <Header :show-name="false"/>
    <div style="height: 10px; width: 100vw; background-color: #f0f0f0"/><!-- 隙間 -->
    <div class="contents">
      <div class="question"><!-- 問題文 -->
        <QuestionEditor
          v-if="activeQuestion.text"
          :question="activeQuestion.text"
          :is-admin-mode="true"
          @save="save"/>
        <div style="height: 10px; width: 100%"/><!-- 隙間 -->
      </div><!-- 終点:問題文 -->
      <div style="height: 100%; width: 20px"/><!-- 隙間 -->
      <div class="center">
        <div
          class="tabs"
          style="margin-bottom: 25px">
          <ul style="display: flex; justify-content: center">
            <li
              :class="{ 'is-active': isStubMode }"
              @click="isStubMode = true"><a>生徒用画面</a></li>
            <li
              :class="{ 'is-active': !isStubMode }"
              @click="isStubMode = false"><a>教員用画面</a></li>
          </ul>
        </div>
        <div class="editor"><!-- エディタ -->
          <editor
            v-if="isStubMode"
            v-model="stub"
            lang="ruby"
            theme="vibrant_ink"
            @init="editorInit"/>
          <editor
            v-if="!isStubMode"
            v-model="answerContent"
            lang="ruby"
            theme="vibrant_ink"
            @init="editorInit"/>
          <div style="height: 10px; width: 100%"/><!-- 隙間 -->
          <div class="editorButton">
            <div style="width: 50%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-start">
              <button
                v-if="!isStubMode"
                class="button is-primary"
                @click="run">
                <span>実行</span>
              </button>
              <button
                v-if="isStubMode"
                class="button is-primary"
                @click="save">
                <span>保存</span>
              </button>
            </div>
            <div style="width: 50%; height: 100%; display: flex; flex-wrap: wrap; justify-content: flex-end">
              <button
                v-if="!isStubMode"
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
          class="tabs"
          style="width: 100%; margin-bottom: 5px">
          <ul style="display: flex; justify-content: center">
            <li
              :class="{ 'is-active': (isResult && !isAnswer && !isAssistant)}"
              @click="isResult = true; isAnswer = false; isAssistant = false"><a>実行結果</a></li>
            <li
              :class="{ 'is-active': (!isResult && isAnswer && !isAssistant) }"
              @click="isAnswer = true; isResult = false; isAssistant = false"><a>正解一覧</a></li>
            <li
              :class="{ 'is-active': (!isResult && !isAnswer && isAssistant) }"
              @click="isAssistant = true; isAnswer = false; isResult = false"><a>アシスタント</a></li>
          </ul>
        </div>
        <div
          v-if="isResult"
          class="result">
          <div class="console">
            <div v-if="consoleOut.length !== 0">
              <div
                v-for="out in consoleOut"
                :key="out.index">{{ out }}</div>
            </div>
          </div><!-- 終点:コンソール -->
        </div>
        <div
          v-if="isAnswer"
          class="answer">
          <div style="width: 100%; height: 10px"/>
          <div style="width: 100%; height: 10px"/>
          <div v-if="activeQuestion.answers">
            <div style="max-height: 20vh; overflow-x: scroll">
              <div
                v-for="n in Object.keys(activeQuestion.answers)"
                :key="n"
                style="display: flex">
                <input
                  v-if="activeQuestion.answers"
                  :value="activeQuestion.answers[n]"
                  class="input"
                  type="text"
                  style="margin-left: 10px; margin-right: 10px; width: 82%; height: 44px; margin-bottom: 10px"
                  disabled>
                <span
                  style="height: 40px; width: 40px; background-color: #eb4c64; display: flex; justify-content: center; align-items: center"
                  @click="deleteAnswer(n)">
                  <i
                    class="fas fa-trash-alt"
                    style="color: white; font-size: 26px; text-align: center"/>
                </span>
              </div>
            </div>
          </div>
          <input
            v-model="inputAnswer"
            class="input"
            type="text"
            placeholder="e.g) Hello World"
            style="margin-left: 10px; margin-right: 10px; width: 92%; height: 44px; margin-bottom: 10px">
          <span
            class="icon"
            style="width: 100%; height: 44px; font-size: 36px">
            <i
              class="fas fa-plus-circle"
              @click="addAnswer"
            />
          </span>
          <div style="width: 100%; height: 10px"/>
        </div><!-- 終点:回答一覧 -->
        <div
          v-if="isAssistant"
          class="assistant">
          <div style="width: 100%; height: 10px"/>
          <div v-if="activeQuestion.assistants">
            <div style="max-height: 40vh; overflow-y: scroll">
              <div
                v-for="n in Object.keys(activeQuestion.assistants)"
                :key="n"
                style="display: flex; flex-wrap: wrap; justify-content: center; position: relative">
                <div style="width: 100%; height: 10px"/>
                <div style="width: 95%; border: #999999 1px solid; min-height: 20vh; padding: 5px">
                  <div style="margin-left: 10px">誤答内容</div>
                  <input
                    v-if="activeQuestion.assistants"
                    :value="activeQuestion.assistants[n].answer.join(',')"
                    class="input"
                    type="text"
                    style="margin-left: 10px; margin-right: 10px; width: 90%; height: 44px; margin-bottom: 10px"
                    disabled>
                  <div style="margin-left: 10px">コメント</div>
                  <input
                    v-if="activeQuestion.assistants"
                    :value="activeQuestion.assistants[n].comment"
                    class="input"
                    type="text"
                    style="margin-left: 10px; margin-right: 10px; width: 90%; height: 44px; margin-bottom: 10px"
                    disabled>
                  <span
                    class="icon"
                    style="width: 22px; height: 22px; font-size: 33px; position: absolute; top: 20px; right: 20px;"
                    @click="removeAssistant(n)">
                    <i
                      class="far fa-times-circle"
                      style="color: red"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 20px"/>
          <div style="display: flex; flex-wrap: wrap; justify-content: center">
            <div style="width: 95%; border: #999999 1px solid; min-height: 20vh; padding: 5px">
              <div style="margin-left: 10px">誤答内容</div>
              <input
                v-model="assistantAnswer"
                class="input"
                type="text"
                style="margin-left: 10px; margin-right: 10px; width: 90%; height: 44px; margin-bottom: 10px">
              <div style="margin-left: 10px">コメント</div>
              <input
                v-model="assistantComment"
                class="input"
                type="text"
                style="margin-left: 10px; margin-right: 10px; width: 90%; height: 44px; margin-bottom: 10px">
            </div>
          </div>
          <span
            class="icon"
            style="width: 100%; height: 44px; font-size: 36px">
            <i
              class="fas fa-plus-circle"
              @click="addAssistant"
            />
          </span>
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
  </div>
</template>

<script>
import Header from '../../components/Header'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import QuestionEditor from '../../components/QuestionEditor'

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
      isStubMode: true,
      stub: '',
      inputAnswer: '',
      isResult: true,
      isAnswer: false,
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
      'activeQuestion'
    ]),
    ...mapGetters('users', ['name'])
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
      if (this.activeQuestion.stub) {
        this.stub = this.activeQuestion.stub
      }
    }
  },
  mounted() {
    this.question = this.activeQuestion.text
    console.log('this.activeQuestion.text', this.activeQuestion.text)
    if (this.activeQuestion.stub) {
      this.stub = this.activeQuestion.stub
    }
  },
  async created() {
    Opal.load('opal')
    Opal.load('opal-parser')
    await this.getAllQuestions()
    console.log('allQuestions', this.allQuestions)
    console.log(
      'allQuestions.length',
      Object.keys(this.allQuestions[0].question).length
    )
    await this.getQuestion({
      chapterIndex: this.activeChapterIndex,
      questionIndex: this.activeQuestionIndex
    })
    await this.getAnswer({
      name: this.name,
      chapterIndex: this.activeChapterIndex,
      questionIndex: this.activeQuestionIndex
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
      'removeAnswerAssistant'
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
    },
    async save(newQuestion) {
      let params = {
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex,
        text: newQuestion,
        answers: this.activeQuestion.answers,
        functionName: this.activeQuestion['function-name'],
        stub: this.stub
      }
      await this.updateQuestion(params)
    },
    async addAnswer() {
      if (!this.inputAnswer) return ''
      let answers = Object.assign([], this.activeQuestion.answers)
      answers.push(this.inputAnswer)
      let params = {
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex,
        answers: answers
      }
      await this.addAnswerToQuestion(params)
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
      })
      this.inputAnswer = ''
    },
    async deleteAnswer(answerIndex) {
      await this.removeAnswerFromQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex,
        answerIndex: answerIndex
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
      })
      this.inputAnswer = ''
    },
    async addAssistant() {
      if (!this.assistantAnswer || !this.assistantComment) return ''
      await this.addAnswerAssistant({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex,
        assistants: this.assistantAnswer,
        comment: this.assistantComment
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
      })
      this.assistantAnswer = ''
      this.assistantComment = ''
    },
    async removeAssistant(key) {
      await this.removeAnswerAssistant({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex,
        key: key
      })
      await this.getAllQuestions()
      await this.getQuestion({
        chapterIndex: this.activeChapterIndex,
        questionIndex: this.activeQuestionIndex
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
      height: 72vh;
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
      height: 72vh;
      border: #999999 1px solid;
      margin-top: 10px;
      background-color: #f0f0f0;
    }

    .assistant {
      width: 32vw;
      height: 72vh;
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
