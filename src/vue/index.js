const {app} = require('./src/vue/mainApp.js');
const {progressBar} = require('./src/vue/progressApp.js');
const {findToolbar} = require('./src/vue/findApp.js');
const {TabHolder} = require('./src/TabHolder.js');
const {eventBus} = require('./src/vue/eventBus.js');

window.progressBar = progressBar;

window.app = app;

window.findToolbar = findToolbar;

window.tabManager = new TabHolder();

eventBus.$on('settingsManager/changeScrollResolution',
  val => window.settingsManager.scrollResolution = val);
eventBus.$on('settingsManager/changeLineWrap',
  val => window.settingsManager.setLineWraps(val));

window.settingsManager = {
  scrollResolution: 1,

  setLineWraps(val){
    eventBus.$emit('app/changeWrap', val);
  }
};

module.exports = {
  'progressBar': window.progressBar,
  'app': window.app,
  'findToolbar': window.findToolbar
};
