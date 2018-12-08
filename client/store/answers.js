import { db } from '../plugins/firebase'
import _ from 'lodash'

export const state = () => ({
  answersByUser: {},
  currentCategoryId: 0,
  currentQuestionId: 0
})

export const mutations = {
  setAnswersByUser(state, payload) {
    state.answersByUser = payload || {}
  },
  setCurrentCategoryId(state, payload) {
    state.currentCategoryId = payload || 0
  },
  setCurrentQuestionId(state, payload) {
    state.currentQuestionId = payload || 0
  }
}

export const actions = {
  async getAnswersByUser({ commit, state }, name) {
    const answerCollection = db.collection('answers')
    const answers = await answerCollection.get().then(querySnapshot => {
      return querySnapshot.docs.map(doc => doc.data())
    })
    const answersByUsers = answers[0].answersByUser[name] || {}
    const answersByUsersSortByCategory = _.orderBy(
      answersByUsers,
      ['categoryIndex'],
      ['asc']
    )
    commit('setAnswersByUser', answersByUsersSortByCategory)
  },
  async setCurrentCategoryAndQuestion({ commit }, categoryId, questionId) {
    commit('setCurrentCategoryId', categoryId)
    commit('setCurrentQuestionId', questionId)
  },
  async nextQuestion({ commit }) {
    const currentQuestionId = state.currentQuestionId
    commit('setCurrentQuestionId', questionId + 1) //FIXME 問題数の上限を考慮
  },
  async prevQuestion({ commit }) {
    const currentQuestionId = state.currentQuestionId
    const newQuestionId = currentQuestionId - 1 < 1 ? 1 : questionId - 1
    commit('setCurrentQuestionId', newQuestionId)
  }
}

export const getters = {
  answersByUser(state) {
    return state.answersByUser
  }
}
