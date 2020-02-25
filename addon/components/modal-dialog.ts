import Component from '@glimmer/component';
import {oneWay} from '@ember/object/computed';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export interface ModalDialogArgs {
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

export default class ModalDialog extends Component<ModalDialogArgs> {
  @service modalDialog!: ModalDialog;

  @oneWay('modalDialog.destinationElementId') destinationElementId!: string;

  // containerClass - set this from templates
  containerClassNames: string[] = (this.args.containerClassNames ?? []).concat('ember-modal-dialog'); // set this in a subclass definition

  // overlayClass - set this from templates
  overlayClassNames: string[] = (this.args.overlayClassNames ?? []).concat('ember-modal-overlay'); // set this in a subclass definition

  // wrapperClass - set this from templates
  wrapperClassNames: string[] = (this.args.wrapperClassNames ?? []).concat('ember-modal-wrapper'); // set this in a subclass definition

  @action
  onClose() {
    this.args.onClose?.();
  }

  @action
  onClickOverlay(e: MouseEvent) {
    const {onClickOverlay, onClose} = this.args;

    e.preventDefault();

    if (onClickOverlay) {
      onClickOverlay();
    } else {
      onClose?.();
    }
  }
}
