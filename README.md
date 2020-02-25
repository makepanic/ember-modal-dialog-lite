# Ember Modal Dialog Lite

__This is a fork of [ember-modal-dialog](https://github.com/yapplabs/ember-modal-dialog) that removes all of the animation and tethering related functionality.__

The fork was migrated to TS and glimmer components.

## Installation

```sh
ember install @makepanic/ember-modal-dialog-lite
```

The ember-modal-dialog addon provides components to implement modal dialogs throughout an Ember application using a simple, consistent pattern.

Unlike some other modal libraries for Ember, ember-modal-dialog uses solutions like [ember-wormhole](//github.com/yapplabs/ember-wormhole) to render a modal structure as a top-level DOM element for layout purposes while retaining its logical position in the Ember view hierarchy. This difference introduces a certain elegance and, dare we say, joy, into the experience of using modals in your app. For more info on this, see the "Wormhole" section below.

## Table of Contents

<!-- toc -->

- [Live Demo and Test Examples](#live-demo-and-test-examples)
- [Including In An Ember Application](#including-in-an-ember-application)
- [Upgrading](#upgrading)
- [Controller-bound Usage](#controller-bound-usage)
- [Routable Usage](#routable-usage)
- [Configurable Properties](#configurable-properties)
  * [modal-dialog](#modal-dialog)
- [Which Component Should I Use?](#which-component-should-i-use)
- [Positioning](#positioning)
    + [Caveats](#caveats)
- [Wormholes](#wormholes)
- [Configuring the Modal Root Element Id](#configuring-the-modal-root-element-id)
- [Configuring Styles](#configuring-styles)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [iOS](#ios)
- [Custom Modals](#custom-modals)
- [Using as a nested addon](#using-as-a-nested-addon)
- [Dependencies](#dependencies)
- [Additional Resources](#additional-resources)
- [Contributing](#contributing)
- [Credits](#credits)

<!-- tocstop -->

## Live Demo and Test Examples

View a live demo here: [http://yapplabs.github.io/ember-modal-dialog/](http://yapplabs.github.io/ember-modal-dialog/)

Test examples are located in `tests/dummy/app/templates/application.hbs` and can be run locally by following the instructions in the "Installation" and "Running" sections below.

[![Video image](https://i.vimeocdn.com/video/558401687_640x360.jpg)](https://vimeo.com/157192323)

## Including In An Ember Application

Here is the simplest way to get started with ember-modal-dialog:

```sh
ember install @makepanic/ember-modal-dialog-lite
```

Then import the CSS files

**app.css**
```css
@import "ember-modal-dialog-lite/ember-modal-structure.css";
@import "ember-modal-dialog-lite/ember-modal-appearance.css";
```

If you’re using SASS then just import the CSS slightly differently

**app.scss**
```scss
@import "ember-modal-dialog-lite/ember-modal-structure";
@import "ember-modal-dialog-lite/ember-modal-appearance";
```

**application.hbs**
```htmlbars
{{#modal-dialog}}
  Oh hai there!
{{/modal-dialog}}
```

## Upgrading

Earlier versions of `ember-modal-dialog` required `ember-cli-sass` and an `app.scss` file to import styling.

Please be aware this is no longer the case.

Existing applications should continue to work correctly but if you were using `ember-cli-sass` solely due to `ember-modal-dialog` it might be worthwhile removing `ember-cli-sass` completely and just importing the styles directly into `app.css` instead, as shown above.

## Controller-bound Usage

Here is a more useful example of how to conditionally display a modal based on a user interaction.

**Template**

```htmlbars
<button {{action (action "toggleModal")}}>Toggle Modal</button>

{{#if isShowingModal}}
  {{#modal-dialog
      onClose=(action "toggleModal")
      targetAttachment="center"
      translucentOverlay=true
  }}
    Oh hai there!
  {{/modal-dialog}}
{{/if}}
```

**Controller**

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  isShowingModal: false,
  actions: {
    toggleModal: function() {
      this.toggleProperty('isShowingModal');
    }
  }
});
```

## Routable Usage

To have a modal open for a specific route, just drop the `{{modal-dialog}}` into that route's template. Don't forget to have an `{{outlet}}` on the parent route.

## Configurable Properties

### modal-dialog

The modal-dialog component supports the following properties:

Property              | Purpose
--------------------- | -------------
`translucentOverlay`  | Indicates translucence of overlay, toggles presence of `translucent` CSS selector
`onClose`               | The action handler for the dialog's `onClose` action. This action triggers when the user clicks the modal overlay.
`onClickOverlay`      | An action to be called when the overlay is clicked. If this action is specified, clicking the overlay will invoke it instead of `onClose`.
`clickOutsideToClose` | Indicates whether clicking outside a modal *without* an overlay should close the modal. Useful if your modal isn't the focus of interaction, and you want hover effects to still work outside the modal.
`containerClass`      | CSS class name(s) to append to container divs. Set this from template.
`containerClassNames` | CSS class names to append to container divs. This is a concatenated property, so it does **not** replace the default container class (default: `'ember-modal-dialog'`. If you subclass this component, you may define this in your subclass.)
`overlayClass`        | CSS class name(s) to append to overlay divs. Set this from template.
`overlayClassNames`   | CSS class names to append to overlay divs. This is a concatenated property, so it does **not** replace the default overlay class (default: `'ember-modal-overlay'`. If you subclass this component, you may define this in your subclass.)
`wrapperClass`        | CSS class name(s) to append to wrapper divs. Set this from template.
`wrapperClassNames`   | CSS class names to append to wrapper divs. This is a concatenated property, so it does **not** replace the default container class (default: `'ember-modal-wrapper'`. If you subclass this component, you may define this in your subclass.)

## Which Component Should I Use?

Various modal use cases are best supported by different DOM structures. Ember Modal Dialog's `modal-dialog` component provides the following capabilities:

- modal-dialog: Uses ember-wormhole to append the following parent divs to the destination element: wrapper div > overlay div > container div

    ![](tests/dummy/public/modal-dialog.png)

## Positioning

With the default CSS provided, your modal will be centered in the viewport. By adjusting the CSS, you can adjust this logic.

## Wormholes

Display of a modal dialog is typically triggered by a user interaction. While the content in the dialog is related to the content in the user interaction, the underlying display mechanism for the dialogs can be shared across the entire application.

The `add-modals-container` initializer appends a container element to the `application.rootElement`. It injects a reference to this container element id as a property of the `modal-dialog` service, which is then used in the `modal-dialog` component. The property is injected into a service instead of directly into the `modal-dialog` component to make it easier to extend the component and make custom modals.

ember-modal-dialog uses ember-wormhole to append modal overlays and contents to a dedicated element in the DOM. This decouples the DOM location of a modal from the DOM location of whatever triggered its display... hence wormholes!

## Configuring the Modal Root Element Id

This default id of the modal root element is `modal-overlays` and can be overridden in environment application options as follows:

**environment.js**
```javascript
module.exports = function(environment) {
  var ENV = {
    // ...
    APP: {
      // ...
      emberModalDialog: {
        modalRootElementId: 'custom-modal-root-element'
      }
    }
  };
  // ...

  return ENV;
};
```

## Configuring Styles

You can import the CSS files directly

**app.css**
```css
@import "ember-modal-dialog-lite/ember-modal-structure.css";
@import "ember-modal-dialog-lite/ember-modal-appearance.css";
```

If you’re using SASS then just import the CSS slightly differently

**app.scss**
```scss
@import "ember-modal-dialog-lite/ember-modal-structure";
@import "ember-modal-dialog-lite/ember-modal-appearance";
```

## Keyboard shortcuts

A quick-and-dirty way to implement keyboard shortcuts (e.g. to dismiss your modals with `escape`) is to subclass the dialog and attach keyboard events:

```js
// app/components/modal-dialog.js
import ModalDialog from '@makepanic/ember-modal-dialog-lite/components/modal-dialog';

const ESC_KEY = 27;

export default ModalDialog.extend({
  didInsertElement() {
    this._super(...arguments);
    this._initEscListener();
  },

  willDestroyElement(){
    this._super(...arguments);
    Ember.$('body').off('keyup.modal-dialog');
  },

  _initEscListener() {
    const closeOnEscapeKey = (ev) => {
      if (ev.keyCode === ESC_KEY) { this.get('onClose')(); }
    };

    Ember.$('body').on('keyup.modal-dialog', closeOnEscapeKey);
  },
});
```

This can work, but some apps require a more sophisticated approach. One approach takes advantage of the [ember-keyboard](https://github.com/null-null-null/ember-keyboard) library. Here's an example:

```javascript
// app/components/modal-dialog.js
import Ember from 'ember';
import ModalDialog from '@makepanic/ember-modal-dialog-lite/components/modal-dialog';
import { EKMixin as EmberKeyboardMixin, keyDown } from 'ember-keyboard';

export default ModalDialog.extend(EmberKeyboardMixin, {
  init() {
    this._super(...arguments);

    this.set('keyboardActivated', true);
  },

  closeOnEsc: Ember.on(keyDown('Escape'), function() {
    this.get('onClose')();
  })
});
```

View [the library](https://github.com/null-null-null/ember-keyboard) for more information.

## iOS

In order for taps on the overlay to be functional on iOS, a `cursor: pointer` style is added to the `div` when on iOS. If you need to change this behavior, subclass modal-dialog and override `makeOverlayClickableOnIOS`.

## Custom Modals

If you have various different styles of modal dialog in your app, it can be useful to subclass the dialog as a new component:

```js
// app/components/full-screen-modal.js

import ModalDialog from '@makepanic/ember-modal-dialog-lite/components/modal-dialog';

export default ModalDialog.extend({
  containerClassNames: "full-screen-modal",
  targetAttachment: "none"
});
```

By subclassing `modal-dialog` your component will use the default modal dialog template. Therefore, you do not need to create a `app/templates/components/full-screen-modal.hbs` file.
Your component can then be used like so:

```htmlbars
{{#full-screen-modal}}
  Custom modal contents
{{/full-screen-modal}}
```
## Using as a nested addon

If you create an addon that you want to depend on ember-modal-dialog, you need to provide for ember-modal-dialog's config hook to run. You do this in the config hook of your addon. Example:

```js
// index.js

module.exports = {
  name: 'my-addon',
  config: function(environment, appConfig) {
    let initialConfig = _.merge({}, appConfig);
    let updatedConfig = this.addons.reduce((config, addon) => {
      if (addon.config) {
        _.merge(config, addon.config(environment, config));
      }
      return config;
    }, initialConfig);
    return updatedConfig;
  }
};
```

## Dependencies

* For Ember versions >= 2.8, use the latest published version (Note that ember-cli >= 2.13 is required, though your ember version may be >= 2.8)
* For Ember versions >= 2.4 and < 2.8, use the latest 2.x version
* For Ember versions >= 1.10 and < 2.4, use ember-modal-dialog 1.0.0 _(Due to a bug in these versions of Ember, you may have trouble with Ember 1.13.7, 1.13.8 and 1.13.9 -- See #71)_

## Additional Resources

* [Screencast on using ember-modal-dialog](https://www.emberscreencasts.com/posts/74-ember-modal-dialog)

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## Credits

Contributions from @stefanpenner, @krisselden, @chrislopresto, @lukemelia, @raycohen, @andrewhavens, @samselikoff and
others. [Yapp Labs](http://yapplabs.com) was an Ember.js consultancy based in NYC, that has since been folded into [Yapp](https://www.yapp.us).
