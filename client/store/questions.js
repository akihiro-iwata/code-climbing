import { db } from '../plugins/firebase'

export const state = () => ({
  allQuestions: []
})

export const mutations = {
  SET_ALL_QUESTIONS(state, payload) {
    state.allQuestions = payload || []
  }
}

export const actions = {
  async getAllQuestions({ commit }) {
    let teachers = (await db.ref('/teachers').once('value')).val()
    const TEACHER_ID = 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c' // FIXME
    let teacher = {}
    for (let t of teachers) {
      if (t.id === TEACHER_ID) teacher = t
    }
    commit('SET_ALL_QUESTIONS', teacher.chapters)
  }
}

export const getters = {
  allQuestions(state) {
    return state.allQuestions
  }
}
