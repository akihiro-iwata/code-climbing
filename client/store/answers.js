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
  async getAnswer({ commit }, { name, chapterIndex, questionIndex }) {
    let students = (await db.ref('/students').once('value')).val()
    let student = {}
    for (let s of students) {
      if (s.name === name) student = s
    }
    let answer = {}
    for (let a of student.answers) {
      if (
        a['chapter-index'] === chapterIndex &&
        a['question-index'] === questionIndex
      ) {
        answer = a
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
        for (let answer of student.answers) {
          let chapterIndex = answer['chapter-index']
          let questionIndex = answer['question-index']
          if (!answersByChapter[chapterIndex]) {
            answersByChapter[chapterIndex] = {}
            answersByChapter[chapterIndex][questionIndex] = {
              correct: answer.correct,
              outputs: answer.output,
              source: answer.source,
              time: answer.time
            }
          } else if (!answersByChapter[chapterIndex][questionIndex]) {
            answersByChapter[chapterIndex][questionIndex] = {
              correct: answer.correct,
              outputs: answer.output,
              source: answer.source,
              time: answer.time
            }
          } else {
            let time = answersByChapter[chapterIndex][questionIndex].time
            answersByChapter[chapterIndex][questionIndex] = {
              correct: answer.correct,
              outputs: answer.output,
              source: answer.source,
              time: time + answer.time
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
