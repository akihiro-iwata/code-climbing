import { db } from '../plugins/firebase'

export const state = () => ({
  allAnswers: [],
  answer: {}
})

export const mutations = {
  SET_ALL_ANSWERS(state, payload) {
    state.allAnswers = payload || []
  }
}

export const actions = {
  async writeAnswer(
    { commit },
    { studentId, chapterIndex, questionIndex, correct, outputs, source, time }
  ) {
    let students = (await db.ref('/students').once('value')).val()
    let studentIndex = ''
    for (let key of Object.keys(students)) {
      if (!students[key]) continue
      if (!students[key].id) continue
      if (students[key].id.trim() === studentId.trim()) {
        studentIndex = key
      }
    }
    if (!studentIndex) return
    let answerPushRef = db.ref(`/students/${studentIndex}/answers`).push()
    await answerPushRef.set({
      'chapter-index': chapterIndex,
      'question-index': questionIndex,
      correct: correct,
      source: source,
      outputs: outputs,
      time: time
    })
  },
  async getAnswer({ commit }, { name, chapterIndex, questionIndex }) {
    let students = (await db.ref('/students').once('value')).val()
    console.log('students', students)
    let student = {}
    for (let s of students) {
      if (!s) continue
      if (!s.name) continue
      if (s.name === name) student = s
    }
    let answer = {}
    for (let key of Object.keys(student.answers)) {
      if (
        student.answers[key]['chapter-index'] === chapterIndex &&
        student.answers[key]['question-index'] === questionIndex
      ) {
        answer = student.answers[key]
      }
    }
    console.log('answer', answer)
  },
  async getAllAnswers({ commit }) {
    try {
      let students = (await db.ref('/students').once('value')).val()
      let answers = students.map(student => {
        //問題ごとに一意に
        let data = {
          name: student.name,
          answersByChapter: []
        }
        let answersByChapter = {}
        console.log('student', student)
        for (let key of Object.keys(student.answers)) {
          let chapterIndex = student.answers[key]['chapter-index']
          let questionIndex = student.answers[key]['question-index']
          if (!answersByChapter[chapterIndex]) {
            answersByChapter[chapterIndex] = {}
            answersByChapter[chapterIndex][questionIndex] = {
              correct: student.answers[key].correct,
              outputs: student.answers[key].output,
              source: student.answers[key].source,
              time: student.answers[key].time
            }
          } else if (!answersByChapter[chapterIndex][questionIndex]) {
            answersByChapter[chapterIndex][questionIndex] = {
              correct: student.answers[key].correct,
              outputs: student.answers[key].output,
              source: student.answers[key].source,
              time: student.answers[key].time
            }
          } else {
            let time = answersByChapter[chapterIndex][questionIndex].time
            answersByChapter[chapterIndex][questionIndex] = {
              correct: student.answers[key].correct,
              outputs: student.answers[key].output,
              source: student.answers[key].source,
              time: time + student.answers[key].time
            }
          }
        }
        for (let k in answersByChapter) {
          let count = 0
          let time = 0
          let answersByQuestion = answersByChapter[k]
          for (let key in answersByQuestion) {
            time += answersByQuestion[key].time
            if (answersByQuestion[key].correct) count++
          }
          answersByChapter[k]['correctCount'] = count
          answersByChapter[k]['sumTime'] = time
        }
        data.answersByChapter = answersByChapter
        return data
      })
      commit('SET_ALL_ANSWERS', answers)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export const getters = {
  allAnswers(state) {
    return state.allAnswers
  },
  answer(state) {
    return state.answer
  }
}
