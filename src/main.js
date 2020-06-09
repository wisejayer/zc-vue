import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import store from './store'
import {initMenu} from './utils/utils'
import Router from 'vue-router'

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

const originalPush = Router.prototype.push/**决解点击多次路由报错 */
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next)=> {

  let user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    if (to.meta.requireAuth || to.name == null) {
      next({path: '/', query: {redirect: to.path}})
    } else {
      next();
    }
  } else {
    initMenu(router, store);
    next();
  }
}
)

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
