<template>
  <div class="editor">
    <textarea
      v-if="isEditMode"
      v-model="innerQuestion"
      class="textarea"
      placeholder="問題文をここに書きましょう"
      @input="input"/>
    <div
      v-if="!isEditMode"
      id="preview"
      class="preview markdown-body"
      v-html="preview"/>
    <div style="height: 10px; width: 100%"/><!-- 隙間 -->
    <div style="width: 100%; height: 5vh; display: flex; align-items: center">
      <button
        v-if="isEditMode && isAdminMode"
        class="button is-info"
        @click="toPreview">
        <span>プレビュー</span>
      </button>
      <button
        v-if="!isEditMode && isAdminMode"
        class="button is-info"
        @click="toEdit">
        <span>編集</span>
      </button>
      <div style="height: 100%; width: 10px"/>
      <button
        v-if="isAdminMode"
        class="button is-primary"
        @click="save">
        <span>保存</span>
      </button>
      <div style="height: 100%; width: 10px"/>
      <div
        v-if="isEdit"
        style="display: flex; justify-content: center; align-items: center; color: red; font-size: 14px; width: 100%; height: 100%;">
        まだ保存していない変更があります。
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlightjs'

export default {
  name: 'QuestionEditor',
  props: {
    isAdminMode: {
      type: Boolean,
      default: false
    },
    question: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEditMode: false,
      innerQuestion: this.question
    }
  },
  computed: {
    preview() {
      if (!this.innerQuestion) return ''
      return this.renderCheckbox(marked(this.innerQuestion))
    },
    isEdit() {
      return this.isEditMode && this.innerQuestion !== this.question
    }
  },
  watch: {
    question(newVal) {
      this.innerQuestion = newVal
    }
  },
  mounted() {
    marked.setOptions({
      gfm: true,
      breaks: true,
      langPrefix: '',
      fontSize: '20pt',
      highlight: function(code, langAndTitle, callback) {
        const lang = langAndTitle ? langAndTitle.split(':')[0] : ''
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  },
  methods: {
    toPreview() {
      this.isEditMode = false
    },
    toEdit() {
      this.isEditMode = true
    },
    save() {
      this.isEditMode = false
      this.$emit('save', this.innerQuestion)
    },
    renderCheckbox(html) {
      return html
        .replace(/\[x\]/g, '<input type="checkbox" checked="checked">')
        .replace(/\[ \]/g, '<input type="checkbox">')
    },
    input() {
      this.$emit('isEdit', this.isEdit)
    }
  }
}
</script>

<style scoped lang="scss">
.editor {
  width: 100%;
  height: 100%;

  .textarea {
    width: 100%;
    height: 100%;
  }

  .preview {
    min-height: 100%;
    max-height: 100%;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    overflow-x: scroll;
  }
}
</style>
