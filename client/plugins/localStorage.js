import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  window.onNuxtReady(() => {
    console.log('store', store)
    createPersistedState({
      key: 'code-climbing',
      paths: ['users.loggedInUser']
    })(store)
  })
}
