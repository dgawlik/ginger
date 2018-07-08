const {app} = require('./src/vue/mainApp.js');
const {progressBar} = require('./src/vue/progressApp.js');
const {findToolbar} = require('./src/vue/findApp.js');
const {TabHolder} = require('./src/TabHolder.js');
const {eventBus} = require('./src/vue/eventBus.js');

window.progressBar = progressBar;

window.app = app;

window.findToolbar = findToolbar;

window.tabManager = new TabHolder();

module.exports = {
  'progressBar': window.progressBar,
  'app': window.app,
  'findToolbar': window.findToolbar
};
