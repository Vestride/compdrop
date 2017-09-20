<template>
  <div class="help-menu floating-button">
    <button class="help-menu__toggle fade-when-inactive" data-odo-dialog-open="help-dialog" title="open help menu">
      <svg viewBox="0 0 14 16" aria-hidden="true">
        <path d="M6.3 5.69c-.19-.19-.28-.42-.28-.7 0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7-.19.18-.42.3-.7.3-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z" fill-rule="evenodd"/>
      </svg>
    </button>
    <div class="odo-dialog help-dialog" id="help-dialog" role="dialog" aria-labelledby="help-dialog-title" aria-hidden="true">
      <div class="odo-dialog__content container" role="document">
        <div class="odo-dialog__inner">
          <button type="button" class="odo-dialog__close" data-odo-dialog-close aria-label="Close this dialog window">&times;</button>
          <div class="dialog-header">
            <h2 class="type-header-2 marginless" id="help-dialog-title">Compdrop Help</h2>
          </div>
          <div class="row dialog-content">
            <div class="col-6@xs col-6@sm">
              <h3 class="type-header-3">What is this?</h3>
              <p>Compdrop is a simple way to view website designs in a desktop browser. Just drag and drop your images into the browser. Images are aligned to the top of the window and horizontally centered.</p>
              <p>You are viewing files on <em>your own machine</em>. Compdrop <strong>does not store any of your data</strong>.</p>
              <p>Built by <a href="https://glencheney.com">Glen Cheney</a>. Based on the original <a href="https://github.com/lucasishuman/cmpdrp">cmpdrp</a>.</p>
              <p>Compdrop is a progressive web app and you can use it even if you&rsquo;re have no internet connection.</p>
              <p>View the project on <a href="https://github.com/Vestride/compdrop">GitHub</a>.</p>
            </div>
            <div class="col-6@xs col-6@sm">
              <h3 class="type-header-3">Keyboard Shortcuts</h3>
              <keyboard-shortcuts />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Dialog from '../Dialog';

@Component
export default class HelpMenu extends Vue {
  dialog: Dialog;

  toggle(): void {
    if (this.dialog.isOpen) {
      this.dialog.close();
    } else {
      this.dialog.open();
    }
  }

  mounted(): void {
    this.$parent.$on('helptoggle', this.toggle);
    this.dialog = new Dialog(document.getElementById('help-dialog'));
  }

  beforeDestroy(): void {
    this.dialog.dispose();
    this.dialog = null;
  }
}
</script>


<style>
.help-menu {
  right: 12px;
}
</style>

