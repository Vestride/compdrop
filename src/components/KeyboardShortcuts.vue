<template>
  <dl class="unstyled-list shortcut-list" v-once>
    <div v-for="item in shortcuts" :key="item.keys.join()">
      <dt class="shortcut-item__triggers">
        <kbd v-for="trigger in item.keys" :key="trigger">{{ trigger }}</kbd>
      </dt>
      <dd class="shortcut-item__description">{{ item.desc }}</dd>
    </div>
  </dl>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class KeyboardShortcuts extends Vue {
  private shortcuts: any[] = [
    {
      keys: ['→', 'J'],
      desc: 'Next image',
    },
    {
      keys: ['←', 'K'],
      desc: 'Previous image',
    },
    {
      keys: ['⇧ Click'],
      desc: 'Navigate without scrolling to the top',
    },
    {
      keys: ['1', '2', '3'],
      desc: 'Switch collection (numbers 1 through 9)',
    },
    {
      keys: ['?'],
      desc: 'Toggle [this] help menu',
    },
    {
      keys: ['S'],
      desc: 'Toggle settings menu',
    },
    {
      keys: ['C'],
      desc: 'Toggle collection menu',
    },
    {
      keys: ['H'],
      desc: 'Hide Compdrop UI elements',
    },
    {
      keys: ['R'],
      desc: 'Remove all images',
    },
  ];
}
</script>

<style>
/* Styles from Chrome devtools */
kbd {
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #ccc;
  margin: 0 0.1em;
  padding: 0.1em 0.6em;
  color: #333;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2), 0 0 0 2px #ffffff inset;
  border-radius: 3px;
  background-color: #f7f7f7;
  text-shadow: 0 1px 0 #fff;
  line-height: 1;
  font-size: 11px;
  white-space: nowrap;
}

.shortcut-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(auto, max-content));
}

.shortcut-item__triggers {
  grid-column: 1;
  justify-self: flex-end;
}

.shortcut-item__description {
  grid-column: 2;
  margin-top: 1px;
  margin-left: 8px;
}
</style>

