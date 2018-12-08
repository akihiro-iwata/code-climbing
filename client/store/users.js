import { db } from '../plugins/firebase'

export const state = () => ({
  loggedInUser: { name: 'TestUser' }
})

export const mutations = {
  setUser(state, payload) {
    state.loggedInUser = payload || null
  }
}

export const actions = {
  async login({ commit, state }, name) {
    console.log('name', name)
    try {
      //FIXME API化
      const usersCollection = db.collection('users')
      const users = await usersCollection.get().then(querySnapshot => {
        return querySnapshot.docs.map(doc => doc.data())
      })
      const trimedName = name.replace(/\s+/g, '')
      const registered =
        users.filter(user => user.name === trimedName).length !== 0
      if (!registered) {
        //初回利用
        await usersCollection.add({ name: trimedName }).then(docRef => {
          console.log('Document written with ID: ', docRef.id)
        })
      }
      commit('setUser', { name: trimedName })
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
