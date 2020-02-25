import { click, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

const modalRootElementSelector = '#modal-overlays';
const overlaySelector = '.ember-modal-overlay';
const dialogSelector = '.ember-modal-dialog';
const dialogCloseButton = [dialogSelector, 'button'].join(' ');

module('Acceptance: modal-dialog | no animation, no tether', function(hooks) {
  setupApplicationTest(hooks);
  hooks.beforeEach(function() {
    return visit('/');
  });

  test('basic modal', async function(assert) {
    assert.isPresentOnce(modalRootElementSelector);
    assert.isAbsent(overlaySelector);
    assert.isPresentOnce('#example-basic button');

    await assert.dialogOpensAndCloses({
      openSelector: '#example-basic button',
      dialogText: 'Basic',
      closeSelector: overlaySelector
    });

    await assert.dialogOpensAndCloses({
      openSelector: '#example-basic button',
      dialogText: 'Basic',
      closeSelector: dialogCloseButton
    });
  });

  test('modal with translucent overlay', async function(assert) {
    await assert.dialogOpensAndCloses({
      openSelector: '#example-translucent button',
      dialogText: 'With Translucent Overlay',
      closeSelector: overlaySelector
    });

    await assert.dialogOpensAndCloses({
      openSelector: '#example-translucent button',
      dialogText: 'With Translucent Overlay',
      closeSelector: dialogCloseButton
    });
  });

  test('modal without overlay', async function(assert) {
    await assert.dialogOpensAndCloses({
      openSelector: '#example-without-overlay button',
      dialogText: 'Without Overlay',
      closeSelector: '#example-without-overlay'
    });

    await assert.dialogOpensAndCloses({
      openSelector: '#example-without-overlay button',
      dialogText: 'Without Overlay',
      closeSelector: dialogCloseButton
    });
  });

  test('modal with overlay', async function(assert) {
    await assert.dialogOpensAndCloses({
      openSelector: '#example-translucent button',
      dialogText: 'With Translucent Overlay',
      closeSelector: overlaySelector
    });

    await assert.dialogOpensAndCloses({
      openSelector: '#example-translucent button',
      dialogText: 'With Translucent Overlay',
      closeSelector: dialogCloseButton
    });
  });

  test('modal with sibling overlay', async function(assert) {
    await assert.dialogOpensAndCloses({
      openSelector: '#example-overlay-sibling button',
      dialogText: 'With Translucent Overlay as Sibling',
      closeSelector: overlaySelector
    });

    await assert.dialogOpensAndCloses({
      openSelector: '#example-overlay-sibling button',
      dialogText: 'With Translucent Overlay as Sibling',
      closeSelector: dialogCloseButton
    });
  });

  test('clicking translucent overlay triggers callback', async function(assert) {
    window.onClickOverlayCallbackCalled = false;

    await click('#example-translucent-with-callback button');
    await click(overlaySelector);

    assert.isPresentOnce(overlaySelector);
    assert.ok(window.onClickOverlayCallbackCalled);

    await click(dialogCloseButton);

    assert.isAbsent(overlaySelector);
  });

  test('modal with custom styles', async function(assert) {
    await assert.dialogOpensAndCloses({
      openSelector: '#example-custom-styles button',
      dialogText: 'Custom Styles',
      closeSelector: overlaySelector,
      whileOpen() {
        assert.dom(`#ember-testing ${overlaySelector}`).hasClass('custom-styles-overlay', 'has provided overlayClass');
        assert.dom(`#ember-testing ${dialogSelector}`).hasClass('custom-styles-modal-container', 'has provided container-class');
      }
    });
    await assert.dialogOpensAndCloses({
      openSelector: '#example-custom-styles button',
      dialogText: 'Custom Styles',
      closeSelector: dialogCloseButton
    });
  });
});
