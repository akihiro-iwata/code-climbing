import { db } from '../plugins/firebase'

export const state = () => ({
  loggedInTeacher: {
    name: 'TestTeacher',
    id: 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c'
  }
})

export const mutations = {
  SET_TEACHER(state, payload) {
    state.loggedInTeacher = payload || {
      name: 'TestUser',
      id: 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c'
    }
  }
}

export const actions = {
  async login({ commit, state }, id) {
    console.log('name', name)
    try {
      let teachers = (await db.ref('/teachers').once('value')).val()
      let teacher = teachers.filter(user => user.id === id)
      if (teacher.length !== 0) {
        commit('SET_TEACHER', teacher[0])
      } else {
        throw new Error('IDが間違えています。')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export const getters = {
  teacherName(state) {
    return state.loggedInUser.name || 'TestUser'
  }
}
