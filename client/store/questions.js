import { db } from '../plugins/firebase'

const TEACHER_ID = 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c' // FIXME
const SCHOOL_ID = '1'

export const state = () => ({
  allQuestions: [],
  activeChapterIndex: 1,
  activeQuestionIndex: 0,
  activeQuestionIndexNumber: 0,
  activeQuestion: {},
  teacherId: TEACHER_ID,
  teacher: {},
  schoolId: SCHOOL_ID,
  challengeMode: false
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
    let chapters = state.allQuestions
    let questions = __questions(chapters, state.activeChapterIndex)
    let questionIndex = Object.keys(questions)[state.activeQuestionIndexNumber]
    state.activeQuestionIndex = questionIndex
  },
  NEXT_QUESTION(state) {
    state.activeQuestionIndexNumber =
      Number(state.activeQuestionIndexNumber) + 1
    let chapters = state.allQuestions
    let questions = __questions(chapters, state.activeChapterIndex)
    let questionIndex = Object.keys(questions)[state.activeQuestionIndexNumber]
    state.activeQuestionIndex = questionIndex
  },
  SET_TEACHER(state, payload) {
    state.teacher = payload || {}
  },
  SET_CHALLENGE_MODE(state, payload) {
    state.challengeMode = payload
  }
}

const __teachar = async state => {
  let teacher = {}
  let teachers = (await db.ref('/teachers').once('value')).val()
  for (let t of teachers) {
    if (t.id === state.teacherId) teacher = t
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

const __dbRefUrl = (state, addMode) => {
  console.log('state.challengeMode', state.challengeMode)
  if (state.challengeMode) {
    if (addMode)
      return `/schools/0/challenges/${state.activeChapterIndex - 1}/question`
    return `/schools/0/challenges/${state.activeChapterIndex - 1}/question/${
      state.activeQuestionIndex
    }`
  } else {
    if (addMode)
      return `/teachers/0/chapters/${state.activeChapterIndex - 1}/question`
    return `/teachers/0/chapters/${state.activeChapterIndex - 1}/question/${
      state.activeQuestionIndex
    }`
  }
}

export const actions = {
  async getAllQuestions({ commit, state }) {
    if (state.challengeMode) {
      let questions = (await db
        .ref('/schools/0/challenges')
        .once('value')).val()
      commit('SET_ALL_QUESTIONS', questions)
    } else {
      let teacher = await __teachar(state)
      commit('SET_ALL_QUESTIONS', teacher.chapters)
      commit('SET_TEACHER', teacher)
    }
  },
  async updateChapterIndex({ commit }, chapterIndex) {
    commit('SET_ACTIVE_CHAPTER_INDEX', chapterIndex)
  },
  async updateQuestionIndex({ commit }, questionIndex) {
    commit('SET_ACTIVE_QUESTION_INDEX', questionIndex)
  },
  async getQuestion({ commit, state }) {
    let questions = __questions(state.allQuestions, state.activeChapterIndex)
    console.log('questions', questions)
    console.log('state.activeChapterIndex', state.activeChapterIndex)
    console.log('state.activeQuestionIndex', state.activeQuestionIndex)
    commit('SET_ACTIVE_QUESTION', questions[state.activeQuestionIndex])
  },
  async nextQuestion({ commit, dispatch }) {
    commit('NEXT_QUESTION')
    await dispatch('getQuestion')
  },
  async prevQuestion({ commit, dispatch }) {
    commit('PREV_QUESTION')
    await dispatch('getQuestion')
  },
  async addQuestion({ commit, dispatch, state }) {
    let pushRef = db.ref(__dbRefUrl(state, true) + '/').push()
    await pushRef.set({
      text: '問題文を書きましょう',
      answers: [],
      'function-name': '',
      stub: '###'
    })
    await dispatch('getAllQuestions')
  },
  async removeQuestion({ commit, state, dispatch }) {
    db.ref(__dbRefUrl(state)).remove()
    await dispatch('getAllQuestions')
  },
  async updateQuestion(
    { commit, state, dispatch },
    { text, answers, functionName, stub }
  ) {
    db.ref(__dbRefUrl(state)).set({
      text: text,
      answers: answers,
      'function-name': functionName,
      stub: stub
    })
    await dispatch('getAllQuestions')
  },
  async addAnswerToQuestion({ commit, state, dispatch }, { answers }) {
    db.ref(__dbRefUrl(state) + '/answers').set(answers)
    await dispatch('getAllQuestions')
    await dispatch('getQuestion')
  },
  async removeAnswerFromQuestion({ commit, state, dispatch }, { answerIndex }) {
    db.ref(__dbRefUrl(state) + `/answers/${answerIndex}`).remove()
    await dispatch('getAllQuestions')
    await dispatch('getQuestion')
  },
  async addAnswerAssistant(
    { commit, state, dispatch },
    { assistants, comment }
  ) {
    let pushRef = db.ref(__dbRefUrl(state) + '/assistants').push()
    await pushRef.set({
      answer: assistants.split(','),
      comment: comment
    })
    await dispatch('getAllQuestions')
    await dispatch('getQuestion')
  },
  async removeAnswerAssistant({ commit, state, dispatch }, { key }) {
    db.ref(__dbRefUrl(state) + `/assistants/${key}`).remove()
    await dispatch('getAllQuestions')
    await dispatch('getQuestion')
  },
  async changeMode({ commit }, { isChallengeMode }) {
    commit('SET_CHALLENGE_MODE', isChallengeMode)
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
