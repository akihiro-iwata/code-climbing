import { db } from '../plugins/firebase'
import __uuid from '../util/uuid'

const DEFAULT_USER_ID = '8A1A23E4-FCB0-4910-95FA-58FD0267099D'
const DEFAULT_USER_NAME = 'テストユーザー2'

export const state = () => ({
  loggedInUser: {
    name: DEFAULT_USER_NAME,
    id: DEFAULT_USER_ID
  }
})

export const mutations = {
  SET_USER(state, payload) {
    state.loggedInUser = payload || {
      name: DEFAULT_USER_NAME,
      id: DEFAULT_USER_ID
    }
  }
}

const __createInitUser = name => {
  return {
    active: {
      'chapter-index': 1,
      'question-index': 0
    },
    id: __uuid(),
    name: name,
    teacherId: 'fb1cfb60-03d1-43a7-bfa8-f9ccb8d7754c',
    answers: {
      dummy: {
        'chapter-index': 1,
        'question-index': 0,
        outputs: [],
        correct: false,
        source: '',
        time: 0
      }
    },
    challenges: {
      dummy: {
        'chapter-index': 1,
        'question-index': 0,
        outputs: [],
        correct: false,
        source: '',
        time: 0
      }
    }
  }
}

export const actions = {
  async login({ commit, state }, name) {
    try {
      let users = (await db.ref('/students').once('value')).val()
      let exists = users.filter(user => user.name === name)
      let myUser = {}
      if (exists.length === 0) {
        myUser = __createInitUser(name)
        users.push(myUser)
        db.ref('/students').set(users)
      } else {
        myUser = exists[0]
      }
      commit('SET_USER', myUser)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export const getters = {
  name(state) {
    return state.loggedInUser.name || DEFAULT_USER_NAME
  },
  id(state) {
    return state.loggedInUser.id || DEFAULT_USER_ID
  }
}
