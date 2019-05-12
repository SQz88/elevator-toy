import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { shafts: {} },
  mutations: {
    initShafts: (state, shafts) => {
      shafts.forEach(s => {
        Vue.set(state.shafts, s, { dir: 0, floor: 0 })
        // state.shafts = { ...state.shafts, s: { dir: 0, floor: 0 } }
        //   Object.defineProperty(state.shafts, s, {
        //     value: { dir: 0, floor: 0 },
        //     writable: true
        //   })
      })
    },
    shaftState: (state, { id, floor, dir, to }) => {
      state.shafts[id] = { floor, dir, to }
    }
  },
  getters: {
    getShaftState: state => shaft => state.shafts[shaft],
    getAllShafts: state => state.shafts
  }
})
