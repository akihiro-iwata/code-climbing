<template>
  <Question :challenge-mode="true" />
</template>

<script>
import Question from '../components/Question'
import { mapActions } from 'vuex'

export default {
  components: {
    Question
  },
  async created() {
    await this.updateChapterIndex(1)
    await this.updateQuestionIndex(0)
  },
  methods: {
    ...mapActions('questions', ['updateChapterIndex', 'updateQuestionIndex'])
  }
}
</script>
