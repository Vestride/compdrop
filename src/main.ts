import Vue from 'vue';
import App from './App.vue';
import WelcomeScreen from './components/WelcomeScreen.vue';
import ImageViewer from './components/ImageViewer.vue';

Vue.config.productionTip = false;

Vue.component('welcome-screen', WelcomeScreen);
Vue.component('image-viewer', ImageViewer);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
