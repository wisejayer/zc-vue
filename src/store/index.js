import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      username:window.localStorage.getItem('user') == null ? '' : JSON.parse(window.localStorage.getItem('user')).username,
      userid:window.localStorage.getItem('user') == null ? '' : JSON.parse(window.localStorage.getItem('user')).userid,
      routes: []
    },
    mutations: {
      initMenu(state, menus){
        state.routes = menus;
      },        
      login(state, user){
        state.user = user;
        window.localStorage.setItem('user', JSON.stringify(user));
      },
      logout(state){
        window.localStorage.removeItem('user');
        state.routes = [];
      }
    }
  });