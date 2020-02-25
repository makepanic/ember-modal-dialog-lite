/* eslint-env node */
'use strict';

module.exports = function( environment, appConfig, addon ) {
  appConfig['ember-modal-dialog'] = appConfig['ember-modal-dialog'] || {};

  return appConfig;
};
