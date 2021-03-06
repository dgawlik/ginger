const {Vue} = require('./vue.js');

/**
  Events:

  app/displayVirtual
  app/displayBuffer
  app/displayEmpty

  findApp/keyDown
  findApp/closeKeyDown
  findApp/changeValid
  findApp/highlight
  findApp/findPrev
  findApp/findNext

  scrollbar/stopDrag
  scrollbar/mouseMove

  buffer/changePage
  buffer/changeWrap

  tabs/changeWrap
  tabs/activateTab
  tabs/closeTab
  tabs/changeActiveTab

  progressBar/updateProgress
  progressBar/show
  progressBar/hide
*/

let eventBus = new Vue();



module.exports = {
  eventBus
};
