const {Vue} = require('./vue.js');

/**
  Events:

  app/changeWrap

  findApp/keyDown
  findApp/closeKeyDown

  scrollbar/stopDrag
  scrollbar/mouseMove

  buffer/changePage
  buffer/changeWrap

  tabs/changeWrap
  tabs/activateTab
  tabs/closeTab
  tabs/changeActiveTab

  settingsManager/changeScrollResolution
  settingsManager/changeLineWrap

  progressBar/updateProgress
  progressBar/show
  progressBar/hide
*/

let eventBus = new Vue();



module.exports = {
  'eventBus': eventBus
};
