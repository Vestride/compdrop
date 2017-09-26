import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import '@odopod/odo-dialog/css/odo-dialog.css';
import './styles.css';
import WelcomeScreen from './components/WelcomeScreen.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import ImageViewer from './components/ImageViewer.vue';
import CollectionViewer from './components/CollectionViewer.vue';
import HelpMenu from './components/HelpMenu.vue';
import SettingsMenu from './components/SettingsMenu.vue';
import CollectionsMenu from './components/CollectionsMenu.vue';
import KeyboardShortcuts from './components/KeyboardShortcuts.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.component('welcome-screen', WelcomeScreen);
Vue.component('loading-screen', LoadingScreen);
Vue.component('image-viewer', ImageViewer);
Vue.component('collection-viewer', CollectionViewer);
Vue.component('help-menu', HelpMenu);
Vue.component('settings-menu', SettingsMenu);
Vue.component('collections-menu', CollectionsMenu);
Vue.component('keyboard-shortcuts', KeyboardShortcuts);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  template: '<App/>',
  components: { App },
});
