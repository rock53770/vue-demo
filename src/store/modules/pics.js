// 用户填写的信息
export default {
	namespaced: false,
	state: {
		pics:[],
	},
	mutations: {
    add(state,data) {
      state.pics = state.pics.concat(data.pics);
    }
  },
  actions:{
    add({commit},data){
      commit("add",data)
    }
  }
};

