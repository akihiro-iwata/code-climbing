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
              v-for="answersByStudent in allAnswers"
              :key="answersByStudent.index">
              <th style="text-align: center">{{ answersByStudent.name }}</th>
              <th
                v-if="allQuestions.length !== 0"
                style="display: flex; height: 100%; align-items: center; min-width: 32vw">
                <!-- FIXME: 複数チャプター化をしたときは修正 -->
                <span
                  v-for="num in allQuestions[0].question.length"
                  :key="num"
                  :class="{success: isSuccess(1, num, answersByStudent)}"
                  class="progressIcon"/>
              </th>
              <th style="text-align: center">{{ answersByStudent.answersByChapter[1].correctCount }} / {{ questionCount(allQuestions) }}</th>
              <th style="text-align: center">{{ Math.floor(answersByStudent.answersByChapter[1].sumTime / 60) }} 分 {{ answersByStudent.answersByChapter[1].sumTime % 60 }} 秒</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import { mapActions, mapGetters } from 'Vuex'

export default {
  components: {
    Header: Header
  },
  computed: {
    ...mapGetters('answers', ['allAnswers']),
    ...mapGetters('questions', ['allQuestions'])
  },
  async created() {
    await this.getAllAnswers()
    await this.getAllQuestions()
  },
  methods: {
    ...mapActions('answers', ['getAllAnswers']),
    ...mapActions('questions', ['getAllQuestions']),
    goToAnswer() {
      this.$router.push('/')
    },
    questionCount(questions) {
      //FIXME indexごとに
      if (questions.length === 0) return 0
      return questions[0].question.length
    },
    isSuccess(chapterIndex, questionIndex, answersByStudent) {
      let answers = answersByStudent.answersByChapter[chapterIndex]
      return answers[questionIndex] && answers[questionIndex].correct
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
