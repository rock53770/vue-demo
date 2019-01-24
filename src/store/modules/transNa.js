// 用户填写的信息
export default {
	namespaced: false,
	state: {
		transNa: "leftin",
	},
	mutations: {
    setTransNa(state,data) {
      state.transNa = data;
    }
  },
  actions: {
    setTransNa({ state, commit, rootState },data) {
      commit('setTransNa',data)
    }
	}
};

