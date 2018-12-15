<template>
  <div class="page">
    <Header :show-name="true"/>
    <div class="contents">
      <div style="width: 100%; height: 1vh"/><!-- 隙間 -->
      <div class="questionTable">
        <table class="table">
          <thead>
            <tr>
              <th style="text-align: center">タイトル</th>
              <th style="text-align: center">回答状況</th>
              <th style="text-align: center">回答数</th>
              <th style="text-align: center">回答時間</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="val in answersByUser"
              :key="val.index">
              <th style="text-align: center">{{ val.category }}</th>
              <th style="display: flex; height: 100%; align-items: center; min-width: 32vw">
                <span
                  v-for="question in val.questions"
                  :key="question.index"
                  :class="{success: isCompleted(question.answers)}"
                  class="progressIcon"
                  @click="goToAnswer(val.categoryIndex, question.questionIndex)"/>
              </th>
              <th style="text-align: center">{{ answerNumberByCategory(val.questions) }} / {{ val.questions.length }}</th>
              <th style="text-align: center">{{ answerTimeByCategory(val.questions) }}秒</th>
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
    ...mapGetters('answers', ['answersByUser']),
    ...mapGetters('users', ['name'])
  },
  async created() {
    await this.getAnswersByUser(this.name)
  },
  methods: {
    ...mapActions('answers', [
      'getAnswersByUser',
      'setCurrentCategoryAndQuestion'
    ]),
    async goToAnswer(categoryIndex, questionIndex) {
      await this.setCurrentCategoryAndQuestion(categoryIndex, questionIndex)
      this.$router.push('/question')
    },
    // answer
    answerNumberByCategory(answerByCategory) {
      return answerByCategory.filter(val => {
        return this.isCompleted(val.answers)
      }).length
    },
    isCompleted(history) {
      return (
        history.filter(val => {
          return val.isCorrect === true
        }).length !== 0
      )
    },
    answerTimeByCategory(answerByCategory) {
      return answerByCategory.reduce((sum, val) => {
        const answerTimeByHistory = val.answers.reduce((sum, val) => {
          return sum + val.time
        }, 0)
        return sum + answerTimeByHistory
      }, 0)
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

    .questionTable {
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
