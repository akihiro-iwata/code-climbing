<template>
  <div>
    <div>Counter: {{ counter }}</div>
    <button
      class="inclement-button"
      @click="inclement">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      counter: 0
    }
  },
  methods: {
    inclement() {
      this.counter++
    }
  }
}
</script>
