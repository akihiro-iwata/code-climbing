<template>
  <QuestionManagement
    :challenge-mode="false"
    @loadStart="loadStart"
    @loadStop="loadStop"
  />
</template>

<script>
import QuestionManagement from '../../components/QuestionManagement'
import { mapActions } from 'vuex'

export default {
  components: {
    QuestionManagement
  },
  async created() {
    await this.updateChapterIndex(1)
    await this.updateQuestionIndex(0)
    await this.updateQuestionIndexNumber(0)
  },
  methods: {
    ...mapActions('questions', [
      'updateChapterIndex',
      'updateQuestionIndex',
      'updateQuestionIndexNumber'
    ]),
    loadStart() {
      this.$emit('startLoading')
    },
    loadStop() {
      console.log('loadStop')
      this.isLoading = false
    }
  }
}
</script>
