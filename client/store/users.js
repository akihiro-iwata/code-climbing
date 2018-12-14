import { db } from '../plugins/firebase'

export const state = () => ({
  loggedInUser: { name: 'TestUser' }
})

export const mutations = {
  SET_USER(state, payload) {
    state.loggedInUser = payload || { name: 'TestUser' }
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
    answers: [
      {
        'chapter-index': 1,
        'question-index': 0,
        outputs: [],
        correct: false,
        source: '',
        time: 0
      }
    ]
  }
}

const __uuid = () => {
  let uuid = '',
    i,
    random
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }
  return uuid
}

export const actions = {
  async login({ commit, state }, name) {
    console.log('name', name)
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
    return state.loggedInUser.name || 'TestUser'
  }
}
