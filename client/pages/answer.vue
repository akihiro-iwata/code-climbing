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
              <th style="text-align: center">ステータス</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(v,k) in answers"
              :key="k">
              <th style="text-align: center">{{ k }}</th>
              <th style="display: flex; height: 100%; align-items: center; min-width: 32vw">
                <span
                  v-for="answer in v"
                  :key="answer.index"
                  :class="{success: (answer === 'ok')}"
                  class="progressIcon"
                  @click="goToAnswer"/>
              </th>
              <th style="text-align: center">{{ v.length }}</th>
              <th style="text-align: center">10:10</th>
              <th style="text-align: center">回答中</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
import Header from '../components/Header'

export default {
  components: {
    Header: Header
  },
  data() {
    return {
      answers: {
        山内麻友子: [
          'ok',
          'ng',
          'skip',
          'ok',
          'ok',
          'ng',
          'ng',
          'ok',
          'ng',
          'ok',
          'ok',
          'ng',
          'skip'
        ],
        熊倉沙耶: [
          'ok',
          'ng',
          'skip',
          'ok',
          'ok',
          'ok',
          'ng',
          'skip',
          'ok',
          'ok',
          'ng',
          'ok'
        ],
        池田春樹: [
          'ok',
          'ng',
          'skip',
          'ok',
          'ok',
          'ng',
          'ng',
          'skip',
          'ok',
          'ok',
          'ng',
          'skip',
          'ok',
          'ok',
          'ng',
          'ok',
          'ng',
          'ok'
        ]
      }
    }
  },
  methods: {
    toggleEditorMode(isAnswerMode) {
      this.isAnswerMode = isAnswerMode
    },
    goToAnswer() {
      this.$router.push('/')
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
    background-color: #f5f5f5;

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
