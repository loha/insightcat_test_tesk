import 'reflect-metadata';
import Vue from 'vue';
import VueMeta from 'vue-meta';
import App from './App.vue';
import router from './router';
import '@/assets/scss/index.scss';

Vue.use(VueMeta);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
