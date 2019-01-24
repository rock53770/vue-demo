// 用户填写的信息
export default {
	namespaced: false,
	state: {
		page:{
      showHeader: true,
      needBack:true,
      menuContent:'',
      back:function(){
        btPage.goBack();
      },
      menuClick:function(){
        // btPage.open({
        //   url: '/quote'
        //   closePageCount:100
        // })
      }
    },//设置样式
	},
	mutations: {
    setHead(state,data) {
      state.page = Object.assign({},{
        showHeader: true,
        needBack:true,
        menuContent:'<div class="menu"></div>',
        back:function(){
          btPage.goBack();
        },
        menuClick:function(){
          btPage.open({
            url: '/quote',
            container_style:1,
            type:3,
          })
        }
      },data);
      console.log(JSON.stringify(state.page))
    }
  },
  actions: {
    setHead({ state, commit, rootState },data) {
      console.log(JSON.stringify(data))
      commit('setHead',data || {})
    }
	}
};

