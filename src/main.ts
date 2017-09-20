import Vue from 'vue';
import App from './App.vue';
import '@odopod/odo-dialog/css/odo-dialog.css';
import './styles.css';
import WelcomeScreen from './components/WelcomeScreen.vue';
import ImageViewer from './components/ImageViewer.vue';
import CollectionViewer from './components/CollectionViewer.vue';
import HelpMenu from './components/HelpMenu.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import CollectionMenu from './components/CollectionMenu.vue';
import KeyboardShortcuts from './components/KeyboardShortcuts.vue';

Vue.config.productionTip = false;

Vue.component('welcome-screen', WelcomeScreen);
Vue.component('image-viewer', ImageViewer);
Vue.component('collection-viewer', CollectionViewer);
Vue.component('help-menu', HelpMenu);
Vue.component('settings-menu', SettingsMenu);
Vue.component('collection-menu', CollectionMenu);
Vue.component('keyboard-shortcuts', KeyboardShortcuts);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
