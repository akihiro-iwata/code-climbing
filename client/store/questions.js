import { db } from '../plugins/firebase'

export const state = () => ({
  allQuestions: [],
  activeChapterIndex: 1,
  activeQuestionIndex: 0,
  activeQuestionIndexNumber: 0,
  activeQuestion: {},
  teacher: {}
})

export const mutations = {
  SET_ALL_QUESTIONS(state, payload) {
    state.allQuestions = payload || []
  },
  SET_ACTIVE_CHAPTER_INDEX(state, payload) {
    state.activeChapterIndex = Number(payload) || 1
  },
  SET_ACTIVE_QUESTION_INDEX(state, payload) {
    state.activeQuestionIndex = Number(payload) || ``
  },
  SET_ACTIVE_QUESTION(state, payload) {
    state.activeQuestion = payload || {}
  },
  PREV_QUESTION(state) {
    state.activeQuestionIndexNumber =
      Number(state.activeQuestionIndexNumber) - 1
    state.activeQuestionIndex = Object.keys(state.allQuestions)[
      state.activeQuestionIndexNumber
    ]
    console.log(
      'prev: state.activeQuestionIndexNumber',
      state.activeQuestionIndexNumber
    )
  },
  NEXT_QUESTION(state) {
    state.activeQuestionIndexNumber =
      Number(state.activeQuestionIndexNumber) + 1
    state.activeQuestionIndex = Object.keys(state.allQuestions)[
      state.activeQuestionIndexNumber
    ]
  },
  SET_TEACHER(state, payload) {
    state.teacher = payload || {}
  }
}
const TEACHER_ID = 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c' // FIXME

const __teachar = async teacherId => {
  let teacher = {}
  let teachers = (await db.ref('/teachers').once('value')).val()
  for (let t of teachers) {
    if (t.id === teacherId) teacher = t
  }
  return teacher
}

const __questions = (chapters, chapterIndex) => {
  let questions = {}
  for (let k in chapters) {
    if (chapters[k]['chapter-index'] === chapterIndex) {
      questions = chapters[k].question
    }
  }
  return questions
}

export const actions = {
  async getAllQuestions({ commit }) {
    let teacher = await __teachar(TEACHER_ID)
    commit('SET_ALL_QUESTIONS', teacher.chapters)
    commit('SET_TEACHER', teacher)
  },
  async updateChapterIndex({ commit }, chapterIndex) {
    commit('SET_ACTIVE_CHAPTER_INDEX', chapterIndex)
  },
  async updateQuestionIndex({ commit }, questionIndex) {
    commit('SET_ACTIVE_QUESTION_INDEX', questionIndex)
  },
  async getQuestion({ commit, state }, { chapterIndex, questionIndexNumber }) {
    let chapters = state.teacher.chapters
    let questions = __questions(chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    commit('SET_ACTIVE_QUESTION', questions[questionIndex])
  },
  async nextQuestion({ commit }) {
    commit('NEXT_QUESTION')
  },
  async prevQuestion({ commit }) {
    commit('PREV_QUESTION')
  },
  async addQuestion({ commit }, { chapterIndex }) {
    let pushRef = db
      .ref(`/teachers/0/chapters/${chapterIndex - 1}/question/`)
      .push()
    await pushRef.set({
      text: '問題文を書きましょう',
      answers: [],
      'function-name': '',
      stub: '###'
    })
  },
  async removeQuestion(
    { commit, state },
    { chapterIndex, questionIndexNumber }
  ) {
    let chapters = state.teacher.chapters
    let questions = __questions(chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    db.ref(
      `/teachers/0/chapters/${chapterIndex - 1}/question/${questionIndex}`
    ).remove()
  },
  async updateQuestion(
    { commit, state },
    { chapterIndex, questionIndexNumber, text, answers, functionName, stub }
  ) {
    let questions = __questions(state.teacher.chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    db.ref(
      `/teachers/0/chapters/${chapterIndex - 1}/question/${questionIndex}`
    ).set({
      text: text,
      answers: answers,
      'function-name': functionName,
      stub: stub
    })
  },
  async addAnswerToQuestion(
    { commit, state },
    { chapterIndex, questionIndexNumber, answers }
  ) {
    let questions = __questions(state.teacher.chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    db.ref(
      `/teachers/0/chapters/${chapterIndex -
        1}/question/${questionIndex}/answers`
    ).set(answers)
  },
  async removeAnswerFromQuestion(
    { commit, state },
    { chapterIndex, questionIndexNumber, answerIndex }
  ) {
    let questions = __questions(state.teacher.chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    db.ref(
      `/teachers/0/chapters/${chapterIndex -
        1}/question/${questionIndex}/answers/${answerIndex}`
    ).remove()
  },
  async addAnswerAssistant(
    { commit, state },
    { chapterIndex, questionIndexNumber, assistants, comment }
  ) {
    let questions = __questions(state.teacher.chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    let pushRef = db
      .ref(
        `/teachers/0/chapters/${chapterIndex -
          1}/question/${questionIndex}/assistants`
      )
      .push()
    await pushRef.set({
      answer: assistants.split(','),
      comment: comment
    })
  },
  async removeAnswerAssistant(
    { commit, state },
    { chapterIndex, questionIndexNumber, key }
  ) {
    let questions = __questions(state.teacher.chapters, chapterIndex)
    let questionIndex = Object.keys(questions)[questionIndexNumber]
    db.ref(
      `/teachers/0/chapters/${chapterIndex -
        1}/question/${questionIndex}/assistants/${key}`
    ).remove()
  }
}

export const getters = {
  allQuestions(state) {
    return state.allQuestions
  },
  activeChapterIndex(state) {
    return state.activeChapterIndex || 1
  },
  activeQuestionIndex(state) {
    return state.activeQuestionIndex || 0
  },
  activeQuestion(state) {
    return state.activeQuestion || {}
  },
  activeQuestionIndexNumber(state) {
    return state.activeQuestionIndexNumber || 0
  }
}
