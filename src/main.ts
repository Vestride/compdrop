import Vue from 'vue';
import App from './App.vue';
import './styles.css';
import '@odopod/odo-dialog/css/odo-dialog.css';
import WelcomeScreen from './components/WelcomeScreen.vue';
import ImageViewer from './components/ImageViewer.vue';
import HelpMenu from './components/HelpMenu.vue';
import KeyboardShortcuts from './components/KeyboardShortcuts.vue';

Vue.config.productionTip = false;

Vue.component('welcome-screen', WelcomeScreen);
Vue.component('image-viewer', ImageViewer);
Vue.component('help-menu', HelpMenu);
Vue.component('keyboard-shortcuts', KeyboardShortcuts);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
