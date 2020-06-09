
import {getRequest} from './api'
import {Message} from 'element-ui'
import axios from 'axios'

export const isNotNullORBlank = (...args)=> {
  for (var i = 0; i < args.length; i++) {
    var argument = args[i];
    if (argument == null || argument == '' || argument == undefined) {
      Message.warning({message: '数据不能为空!'})
      return false;
    }
  }
  return true;
}

export const initMenu = (router, store)=> {
  if (store.state.routes.length > 0) {
    return;
  }else{
      getRequest("/menu").then(resp=> {
        if (resp && resp.status == 200) {
          var fmtRoutes = formatRoutes(resp.data);
          router.addRoutes(fmtRoutes);
          store.commit('initMenu', fmtRoutes);
        }
      })
  }
}
export const formatRoutes = (routes)=> {
  let fmRoutes = [];
  routes.forEach(router=> {
    let {
      path,
      component,
      name,
      meta,
      children
    } = router;
    if (children && children instanceof Array) {
      children = formatRoutes(children);
    }
    let fmRouter = {
      path: path,
      component(resolve){
        if (component.startsWith("home")) {
          require(['../components/' + component + '.vue'], resolve)
        } else if (component.startsWith("stu")) {
          require(['../components/students/' + component + '.vue'], resolve)
        } else if (component.startsWith("mon")) {
          require(['../components/monitors/' + component + '.vue'], resolve)
        } else if (component.startsWith("tea")) {
          require(['../components/teachers/' + component + '.vue'], resolve)
        } else if (component.startsWith("man")) {
          require(['../components/manages/' + component + '.vue'], resolve)
        }
      },
      name: name,
      meta: meta,
      children: children
    };
    fmRoutes.push(fmRouter);
  })
  return fmRoutes;
}