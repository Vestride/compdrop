<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="onClick">Clicky</button>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="http://chat.vuejs.org/" target="_blank" rel="noopener">Vue Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank" rel="noopener">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    up: String
  },
})
export default class Hello extends Vue {
  msg: string = 'Welcome to Your Vue.js PWA';
  up: string;
  // use prop values for initial data
  helloMsg: string = 'Hello, ' + this.up

  onClick(): void {
    console.log(this.msg, this.helloMsg);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
