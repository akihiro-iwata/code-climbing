import { db } from '../plugins/firebase'
import __uuid from '../util/uuid'

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
  challengeMode: false,
  studentKey: 1,
  studentName: '',
  allAnswers: [],
  activeQuestionAnswer: [],
  allChallengeAnswers: [],
  allStudents: {}
})

export const mutations = {
  SET_ALL_QUESTIONS(state, payload) {
    state.allQuestions = payload || []
  },
  SET_ACTIVE_CHAPTER_INDEX(state, payload) {
    state.activeChapterIndex = Number(payload) || 1
  },
  SET_ACTIVE_QUESTION_INDEX(state, payload) {
    state.activeQuestionIndex = Number(payload) || payload
  },
  SET_ACTIVE_QUESTION_INDEX_NUMBER(state, payload) {
    state.activeQuestionIndexNumber = payload || payload
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
    state.activeQuestionAnswer = __answer(state)
  },
  NEXT_QUESTION(state) {
    state.activeQuestionIndexNumber =
      Number(state.activeQuestionIndexNumber) + 1
    let chapters = state.allQuestions
    let questions = __questions(chapters, state.activeChapterIndex)
    let questionIndex = Object.keys(questions)[state.activeQuestionIndexNumber]
    state.activeQuestionIndex = questionIndex
    state.activeQuestionAnswer = __answer(state)
  },
  SET_TEACHER(state, payload) {
    state.teacher = payload || {}
  },
  SET_CHALLENGE_MODE(state, payload) {
    state.challengeMode = payload
  },
  SET_ALL_ANSWERS(state, payload) {
    state.allAnswers = payload
    if (!state.challengeMode) state.activeQuestionAnswer = __answer(state)
  },
  SET_STUDENT_KEY(state, payload) {
    state.studentKey = payload
  },
  SET_STUDENT_NAME(state, payload) {
    state.studentName = payload
  },
  ADD_ANSWER(state, payload) {
    const key = __uuid()
    state.allAnswers[key] = payload
  },
  SET_ALL_CHALLENGES(state, payload) {
    state.allChallengeAnswers = payload
    if (state.challengeMode) state.activeQuestionAnswer = __challenge(state)
  },
  SET_ALL_STUDENTS(state, payload) {
    state.allStudents = payload
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

const __answer = state => {
  let answers = []
  console.log('state.allAnswers', state.allAnswers)
  for (let key of Object.keys(state.allAnswers)) {
    let questionIndex =
      state.activeQuestionIndex === 0 || state.activeQuestionIndex === '0'
        ? Number(state.activeQuestionIndex)
        : state.activeQuestionIndex // work around
    if (
      state.allAnswers[key]['chapter-index'] === state.activeChapterIndex &&
      state.allAnswers[key]['question-index'] === questionIndex
    ) {
      answers.push(state.allAnswers[key])
    }
  }
  console.log('answers', answers)
  return answers
}

const __challenge = state => {
  let challenges = []
  for (let key of Object.keys(state.allChallengeAnswers)) {
    let questionIndex =
      state.activeQuestionIndex === 0 || state.activeQuestionIndex === '0'
        ? Number(state.activeQuestionIndex)
        : state.activeQuestionIndex // work around
    if (
      state.allChallengeAnswers[key]['chapter-index'] ===
        state.activeChapterIndex &&
      state.allChallengeAnswers[key]['question-index'] === questionIndex
    ) {
      challenges.push(state.allChallengeAnswers[key])
    }
  }
  console.log('challenges', challenges)
  return challenges
}

export const actions = {
  /* question */
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
  async updateQuestionIndexNumber({ commit }, questionIndexNumber) {
    commit('SET_ACTIVE_QUESTION_INDEX_NUMBER', questionIndexNumber)
  },
  async getQuestion({ commit, state }) {
    let questions = __questions(state.allQuestions, state.activeChapterIndex)
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
  },
  /* answer */
  async getAllAnswers({ commit, state }, { name }) {
    let students = (await db.ref('/students').once('value')).val()
    console.log('students', students)
    let student = {}
    for (let key of Object.keys(students)) {
      if (!students[key]) continue
      if (!students[key].name) continue
      if (students[key].name === name) {
        student = students[key]
        commit('SET_STUDENT_KEY', key)
        commit('SET_STUDENT_NAME', name)
      }
    }
    commit('SET_ALL_ANSWERS', student.answers)
    commit('SET_ALL_CHALLENGES', student.challenges)
  },
  async addAnswer({ commit, state, dispatch }, { correct, source, time }) {
    let pushRef = db.ref(`/students/${state.studentKey}/answers`).push()
    let answer = {
      'chapter-index': state.activeChapterIndex,
      'question-index': state.activeQuestionIndex,
      correct: correct,
      source: source,
      time: time
    }
    await pushRef.set(answer)
    commit('ADD_ANSWER', answer)
  },
  async getAllStudents({ commit }) {
    let studentsRef = db.ref('/students')
    studentsRef.on('value', function(snapshot) {
      commit('SET_ALL_STUDENTS', snapshot.val())
    })
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
  },
  activeQuestionAnswer(state) {
    return state.activeQuestionAnswer
  },
  allStudents(state) {
    return state.allStudents
  }
}
