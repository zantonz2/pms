// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import store from './store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '.app',
  router,
  store,
  template: '<App/>',
  components: { App },
})

if (!store.state.user.id) {
  router.push("/");
} 



Vue.filter('myDate', function (value) {
  if (!value) return ''
  var option = {
  	year: 'numeric',
  	month: 'numeric',
  	day: 'numeric',
  	hour: 'numeric',
  	minute: 'numeric'
  }
  return new Date(Date.parse(value)).toLocaleString("ru", option)
})

Vue.filter('status', function (value) {
  var out='не определен';
  switch (+value){
    case 0: out='зарегистрированo'; break;
    case 1: out='отгружено'; break;
    case 2: out='ожидает отправки'; break;
    case 3: out='в ремонте'; break; 
  }
  return out
})

Vue.filter('nomenclature', function (value, parametr) {

  for (var i = 0; i < store.state.nomenclature[parametr].length; i++) {
    //console.log(store.state.nomenclature[parametr][i].id, '=',value, store.state.nomenclature[parametr][i].name);
    if (store.state.nomenclature[parametr][i].id===value) {
      return store.state.nomenclature[parametr][i].name;
    }
  }

  return 'не определен'
})