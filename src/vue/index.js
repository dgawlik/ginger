const {app} = require('./src/vue/mainApp.js');
const {dialog} = require('./src/vue/dialogApp.js');
const {findToolbar} = require('./src/vue/findApp.js');
const {TabHolder} = require('./src/TabHolder.js');
const {eventBus} = require('./src/vue/eventBus.js');

window.app = app;

window.findToolbar = findToolbar;

window.dialog = dialog;

window.tabManager = new TabHolder();

module.exports = {
  'progressBar': window.progressBar,
  'app': window.app,
  'findToolbar': window.findToolbar
};
