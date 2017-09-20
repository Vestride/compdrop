<template>
  <div class="settings-menu floating-button">
    <button class="settings-menu__toggle fade-when-inactive" data-odo-dialog-open="settings-dialog" title="open settings menu">
      <svg viewBox="0 0 14 16" aria-hidden="true">
        <path fill-rule="evenodd" d="M14 8.77v-1.6l-1.94-.64-.45-1.09.88-1.84-1.13-1.13-1.81.91-1.09-.45-.69-1.92h-1.6l-.63 1.94-1.11.45-1.84-.88-1.13 1.13.91 1.81-.45 1.09L0 7.23v1.59l1.94.64.45 1.09-.88 1.84 1.13 1.13 1.81-.91 1.09.45.69 1.92h1.59l.63-1.94 1.11-.45 1.84.88 1.13-1.13-.92-1.81.47-1.09L14 8.75v.02zM7 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
      </svg>
    </button>
    <div class="odo-dialog settings-dialog" id="settings-dialog" role="dialog" aria-labelledby="settings-dialog-title" aria-hidden="true">
      <div class="odo-dialog__content container" role="document">
        <div class="odo-dialog__inner">
          <button type="button" class="odo-dialog__close" data-odo-dialog-close aria-label="Close this dialog window">&times;</button>
          <div class="dialog-header">
            <h2 class="type-header-2 marginless" id="settings-dialog-title">Compdrop Settings</h2>
          </div>
          <div class="row dialog-content">
            <div class="col-12@sm">
              <div>
                <input type="checkbox" id="checkbox-centered-layout"
                  :checked="centeredLayout"
                  @change="layoutChange">
                <label for="checkbox-centered-layout">Center images (turn off to scroll them)</label>
              </div>
              <div>
                <input type="checkbox" id="checkbox-retina"
                  :checked="retina"
                  @change="retinaChange">
                <label for="checkbox-retina">Scale images to half size</label>
              </div>
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
export default class SettingsMenu extends Vue {
  dialog: Dialog;
  centeredLayout: boolean = true;
  retina: boolean = false;

  toggle(): void {
    if (this.dialog.isOpen) {
      this.dialog.close();
    } else {
      this.dialog.open();
    }
  }

  mounted(): void {
    this.$parent.$on('settingstoggle', this.toggle);
    this.dialog = new Dialog(document.getElementById('settings-dialog'));
  }

  beforeDestroy(): void {
    this.dialog.dispose();
    this.dialog = null;
  }

  layoutChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.centeredLayout = target.checked;
    this.$emit('layoutchange', this.centeredLayout);
  }

  retinaChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.retina = target.checked;
    this.$emit('retinachange', this.retina);
  }
}
</script>


<style>
.settings-menu {
  right: 52px;
}
</style>

