import OdoDialog from '@odopod/odo-dialog';

const Z_DIALOG = 1050;

class Dialog extends OdoDialog {
  z: number = Z_DIALOG;

  getOpenDialogCount(): number {
    return OdoDialog.Instances.filter((instance: Dialog) => instance.isOpen).length;
  }

  getNextTopLayer(): number {
    const layers = OdoDialog.Instances.map((instance: Dialog) => instance.z);
    return Math.max(...layers) + 20;
  }

  open(): void {
    if (this.getOpenDialogCount() > 0) {
      this.z = this.getNextTopLayer();
      (this.element as HTMLElement).style.zIndex = '' + this.z;
      (this.backdrop as HTMLElement).style.zIndex = '' + (this.z - 5);

      this.once(OdoDialog.EventType.CLOSED, () => {
        this.z = Z_DIALOG;
        (this.element as HTMLElement).style.zIndex = '';
        (this.backdrop as HTMLElement).style.zIndex = '';
      });
    }

    super.open();
  }
}

export default Dialog;
