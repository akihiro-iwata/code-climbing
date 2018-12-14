import { db } from '../plugins/firebase'

export const state = () => ({
  allQuestions: [],
  activeChapterIndex: 1,
  activeQuestionIndex: 0,
  activeQuestion: {}
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
    state.activeQuestionIndex = Number(state.activeQuestionIndex) - 1
  },
  NEXT_QUESTION(state) {
    state.activeQuestionIndex = Number(state.activeQuestionIndex) + 1
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

export const actions = {
  async getAllQuestions({ commit }) {
    let teacher = await __teachar(TEACHER_ID)
    commit('SET_ALL_QUESTIONS', teacher.chapters)
  },
  async updateChapterIndex({ commit }, chapterIndex) {
    commit('SET_ACTIVE_CHAPTER_INDEX', chapterIndex)
  },
  async updateQuestionIndex({ commit }, questionIndex) {
    commit('SET_ACTIVE_QUESTION_INDEX', questionIndex)
  },
  async getQuestion({ commit }, { chapterIndex, questionIndex }) {
    let teacher = await __teachar(TEACHER_ID)
    let chapters = teacher.chapters
    let questions = {}
    for (let k in chapters) {
      if (chapters[k]['chapter-index'] === chapterIndex) {
        questions = chapters[k].question
      }
    }
    commit('SET_ACTIVE_QUESTION', questions[questionIndex])
  },
  async nextQuestion({ commit }) {
    commit('NEXT_QUESTION')
  },
  async prevQuestion({ commit }) {
    commit('PREV_QUESTION')
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
  }
}
