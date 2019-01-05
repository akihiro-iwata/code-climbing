<template>
  <div class="page">
    <Header :show-name="false"/>
    <div class="contents">
      <div style="width: 100%; height: 1vh"/><!-- 隙間 -->
      <div class="title"><h1>回答状況</h1></div>
      <div class="answerTable">
        <table class="table">
          <thead>
            <tr>
              <th style="text-align: center">名前</th>
              <th style="text-align: center">回答状況</th>
              <th style="text-align: center">回答数</th>
              <th style="text-align: center">回答時間</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="key in Object.keys(allStudents)"
              :key="key">
              <th style="text-align: center">{{ allStudents[key].name }}</th>
              <th
                v-if="allQuestions.length !== 0"
                style="display: flex; height: 100%; align-items: center; min-width: 32vw">
                <span
                  v-for="k in Object.keys(allQuestions[0].question)"
                  :key="k"
                  :class="{success: isSuccess(1, k, allStudents[key].answers)}"
                  class="progressIcon"
                  @click="goToAnswer(k, allStudents[key].name)"/>
              </th>
              <th style="text-align: center">{{ correctCount(allStudents[key].answers) }} / {{ Object.keys(allQuestions[0].question).length }}</th>
              <th style="text-align: center">{{ Math.floor(timeCount(allStudents[key].answers) / 60) }} 分 {{ timeCount(allStudents[key].answers) % 60 }} 秒</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/Header'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Header: Header
  },
  computed: {
    ...mapGetters('questions', ['allStudents', 'allQuestions']),
    ...mapGetters('users', ['name']),
    ...mapGetters('teachers', ['teacherName'])
  },
  async created() {
    await this.getAllQuestions()
    await this.getAllStudents()
    await this.updateChapterIndex(1)
    await this.updateQuestionIndex(0)
    this.changeName(this.teacherName)
  },
  methods: {
    ...mapActions('questions', [
      'getAllQuestions',
      'getAllStudents',
      'updateChapterIndex',
      'updateQuestionIndex'
    ]),
    ...mapActions('users', ['changeName']),
    questionCount(questions) {
      //FIXME indexごとに
      if (questions.length === 0) return 0
      return questions[0].question.length
    },
    isSuccess(chapterIndex, questionIndex, answers) {
      let answer = []
      for (let k of Object.keys(answers)) {
        if (
          answers[k]['chapter-index'] === chapterIndex &&
          answers[k]['question-index'] == questionIndex &&
          answers[k].correct === true
        ) {
          answer.push(answers[k])
        }
      }
      return answer.length !== 0
    },
    correctCount(answers) {
      let correctSymbols = []
      for (let key of Object.keys(answers)) {
        let symbol =
          answers[key]['chapter-index'] + '|' + answers[key]['question-index']
        if (correctSymbols.includes(symbol)) continue
        if (answers[key].correct)
          correctSymbols.push(
            answers[key]['chapter-index'] + '|' + answers[key]['question-index']
          )
      }
      return correctSymbols.length
    },
    timeCount(answers) {
      let sum = 0
      for (let key of Object.keys(answers)) {
        sum += answers[key].time
      }
      return sum
    },
    async goToAnswer(questionIndex, name) {
      await this.updateChapterIndex(1)
      await this.updateQuestionIndex(questionIndex)
      this.changeName(name)
      this.$router.push('/teacher/studentQuestion')
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;

  .contents {
    height: 82vh;
    width: 100vw;
    display: flex;
    flex-wrap: wrap;
    background-color: #f0f0f0;

    .title {
      height: 5vh;
      width: 100%;
      display: flex;
      justify-content: center;
      text-align: center;
    }

    .answerTable {
      height: 70vh;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .table {
        min-width: 90%;
        max-width: 90%;
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
}

h1 {
  position: relative;
  padding-left: 15px;
  font-size: 33px;
}
h1:before {
  font-family: 'Font Awesome 5 Free';
  content: '\f0eb';
  background: #ffca2c;
  color: white;
  font-weight: normal;
  font-size: 33px;
  border-radius: 50%;
  left: 0;
  margin-right: 10px;
  width: 33px;
  height: 33px;
  line-height: 33px;
  text-align: center;
  top: 50%;
  -moz-transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.progressIcon {
  height: 2vh;
  width: 2vw;
  margin-bottom: 0;
  margin-right: 2px;
  border-radius: 20%;
  border: #24292e 1px solid;
}
.progressIcon.success {
  background-color: #b2df77;
}
</style>
