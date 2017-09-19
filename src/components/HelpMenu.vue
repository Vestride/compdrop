<template>
  <div class="help-menu">
    <button class="help-menu__toggle fade-when-inactive" data-odo-dialog-open="help-dialog" title="toggle help menu">
      <svg viewBox="0 0 16 16">
        <path d="M8,0C3.582,0,0,3.582,0,8s3.582,8,8,8c4.418,0,8-3.582,8-8S12.418,0,8,0z M8.704,11.574H7.169v-1.506h1.535V11.574z M10.283,7.086C10.201,7.288,10.1,7.461,9.98,7.604C9.859,7.747,9.726,7.87,9.579,7.97C9.432,8.072,9.294,8.173,9.164,8.274 C9.033,8.375,8.918,8.49,8.816,8.621C8.715,8.751,8.651,8.914,8.626,9.11v0.372h-1.32v-0.44c0.02-0.28,0.073-0.515,0.161-0.704 c0.088-0.189,0.191-0.35,0.308-0.484C7.892,7.72,8.016,7.604,8.147,7.506c0.13-0.098,0.251-0.195,0.362-0.293 C8.619,7.115,8.709,7.007,8.777,6.89C8.845,6.773,8.877,6.626,8.87,6.45c0-0.299-0.073-0.521-0.22-0.665 C8.503,5.642,8.299,5.57,8.039,5.57c-0.176,0-0.328,0.034-0.455,0.102c-0.127,0.069-0.231,0.16-0.313,0.274 C7.19,6.061,7.13,6.194,7.091,6.348S7.032,6.665,7.032,6.841H5.595c0.007-0.352,0.067-0.674,0.181-0.968 C5.889,5.58,6.049,5.326,6.255,5.111C6.46,4.895,6.707,4.728,6.998,4.607c0.29-0.121,0.614-0.181,0.973-0.181 c0.463,0,0.849,0.063,1.159,0.191c0.309,0.127,0.559,0.286,0.748,0.474c0.189,0.189,0.324,0.393,0.406,0.611 c0.082,0.218,0.122,0.422,0.122,0.611C10.405,6.626,10.365,6.884,10.283,7.086z"/>
      </svg>
    </button>
    <div class="odo-dialog help-dialog" id="help-dialog" role="dialog" aria-labelledby="help-dialog-title" aria-hidden="true">
      <div class="odo-dialog__content container" role="document">
        <div class="odo-dialog__inner">
          <button type="button" class="odo-dialog__close" data-odo-dialog-close aria-label="Close this dialog window">&times;</button>
          <div class="help-dialog__header">
            <h2 class="type-header-2" id="help-dialog-title">Compdrop Help</h2>
          </div>
          <div class="row help-dialog__content">
            <div class="col-6@sm">
              <h3 class="type-header-3">What is this?</h3>
              <p>Compdrop is a simple way to view website designs in a desktop browser. Just drag and drop your images into the browser. Images are aligned to the top of the window and horizontally centered.</p>
              <p>You are viewing files on <em>your own machine</em>. Compdrop <strong>does not store any of your data</strong>.</p>
              <p>Built by <a href="https://glencheney.com">Glen Cheney</a>. Based on the original <a href="https://github.com/lucasishuman/cmpdrp">cmpdrp</a>.</p>
              <p>Compdrop is a progressive web app and you can use it even if you&rsquo;re have no internet connection.</p>
              <p>View the project on <a href="https://github.com/Vestride/compdrop">GitHub</a>.</p>
            </div>
            <div class="col-6@sm">
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
import OdoDialog from '@odopod/odo-dialog';

@Component
export default class HelpMenu extends Vue {
  dialog: OdoDialog;

  toggle(): void {
    if (this.dialog.isOpen) {
      this.dialog.close();
    } else {
      this.dialog.open();
    }
  }

  mounted(): void {
    this.$parent.$on('helptoggle', this.toggle);
    this.dialog = new OdoDialog(document.getElementById('help-dialog'));
  }

  beforeDestroy(): void {
    this.dialog.dispose();
    this.dialog = null;
  }
}
</script>


<style>
.help-menu {
  position: fixed;
  z-index: 1;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
}

.help-menu__toggle {
  width: inherit;
  height: inherit;
  border: 0;
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  transition: opacity 200ms ease-out;
}

.help-menu__toggle svg {
  display: block;
  width: inherit;
  height: inherit;
  fill: white;
  filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.3));
}

#help-dialog-title {
  margin: 0;
}

h3 {
  margin-top: 0;
}

.odo-dialog__inner {
  border-radius: 12px;
  overflow: hidden;
}

.odo-dialog__close {
  top: 16px;
  right: 12px;
  color: rgb(64, 64, 64);
}

.help-dialog__header {
  padding: 16px;
  background-color: white;
}

.help-dialog__content {
  padding: 16px;
  background-color: rgb(247, 247, 247);
}
</style>

