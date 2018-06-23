const {mainApp} = require('./src/vue/mainApp.js');
const {progressApp} = require('./src/vue/progressApp.js');
const {TabHolder} = require('./src/TabHolder.js');

window.progressBar = new Vue(progressApp);

window.app = new Vue(mainApp);

window.tabManager = new TabHolder();

window.settingsManager = {
  scrollResolution: 1,
  
  setLineWraps(val){
    app.buffer.lineWraps = val;
  }
};
