<template>
  <Question/>
</template>

<script>
import Question from '../components/Question'
import { mapActions } from 'vuex'

export default {
  components: {
    Question
  },
  async created() {
    await this.changeMode({
      isChallengeMode: true
    })
  },
  methods: {
    ...mapActions('questions', ['changeMode'])
  }
}
</script>
