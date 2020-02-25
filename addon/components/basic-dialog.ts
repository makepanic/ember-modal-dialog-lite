import Component from '@glimmer/component';
import {oneWay} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import ModalDialog from "@makepanic/ember-modal-dialog-lite/components/modal-dialog";
import {action} from '@ember/object';

export interface BasicDialogArgs {
  wrapperClass?: string;
  wrapperClassNames?: string[];
  overlayClass?: string;
  overlayClassNames?: string[];
  containerClass?: string;
  containerClassNames?: string[];
  translucentOverlay?: boolean;
  clickOutsideToClose?: boolean;
  destinationElementId?: string;
  onClickOverlay?: Function;
  onClose?: Function;
}

export default class BasicDialog extends Component<BasicDialogArgs> {
  @service() modalDialog!: ModalDialog;

  @oneWay('modalDialog.destinationElementId') destinationElementId!: string;

  variantWrapperClass = 'emd-static';

  get containerClassNamesString() {
    return [
      'ember-modal-dialog-target-attachment-center emd-target-attachment-center',
      this.args.containerClassNames?.join(' '),
      this.args.containerClass
    ].filter(Boolean).join(' ');
  }

  get overlayClassNamesString() {
    return [
      this.args.overlayClassNames?.join(' '),
      this.args.translucentOverlay ? 'translucent' : null,
      this.args.overlayClass
    ].filter(Boolean).join(' ');
  }

  get wrapperClassNamesString() {
    return [
      'ember-modal-dialog-target-attachment-center emd-wrapper-target-attachment-center emd-static',
      this.args.wrapperClassNames?.join(' '),
      this.args.wrapperClass
    ].filter(Boolean).join(' ');
  }

  handleClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLElement | null;

    if (!target) return;

    // if the click has already resulted in the target
    // being removed or hidden, do nothing
    if (target.offsetWidth === 0 && target.offsetHeight === 0) {
      return;
    }

    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    let modalSelector = '.ember-modal-dialog';

    // if the click is within the dialog, do nothing
    let modalEl = document.querySelector(modalSelector);
    if (modalEl && modalEl.contains(target)) {
      return;
    }

    this.args.onClose?.();
  };

  @action
  didInsert() {
    if (!this.args.clickOutsideToClose) {
      return;
    }

    this.makeOverlayClickableOnIOS();

    const registerClick = () => document.addEventListener('click', this.handleClick);

    // setTimeout needed or else the click handler will catch the click that spawned this modal dialog
    setTimeout(registerClick);

    if (this.isIOS) {
      const registerTouch = () => document.addEventListener('touchend', this.handleClick);
      setTimeout(registerTouch);
    }
  }


  willDestroy(): void {
    super.willDestroy();
    document.removeEventListener('click', this.handleClick);
    if (this.isIOS) {
      document.removeEventListener('touchend', this.handleClick);
    }
  }

  get isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  makeOverlayClickableOnIOS() {
    if (this.isIOS) {
      let overlayEl = document.querySelector('div[data-emd-overlay]') as HTMLElement | null;
      if (overlayEl) {
        overlayEl.style.cursor = 'pointer';
      }
    }
  }
}
