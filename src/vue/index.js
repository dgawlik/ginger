const {mainApp} = require('./src/vue/mainApp.js');
const {progressApp} = require('./src/vue/progressApp.js');
const {findApp} = require('./src/vue/findApp.js');
const {TabHolder} = require('./src/TabHolder.js');
const {eventBus} = require('./src/vue/eventBus.js');

window.progressBar = new Vue(progressApp);

window.app = new Vue(mainApp);

window.findToolbar = new Vue(findApp);

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
