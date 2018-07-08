

let settingsStore = {

  state: {
    scrollResolution: 1,
    wrapLines: true
  },

  watchCallbacks: {},

  setScrollResolution (val) {
    this.state.scrollResolution = val;
    this.notify('scrollResolution', val);
  },

  setWrapLines (val) {
    this.state.wrapLines = val;
    this.notify('wrapLines', val);
  },

  watch (propName, fn) {
    this.watchCallbacks[propName] = fn;
  },

  notify (propName, val) {
    if (this.watchCallbacks[propName]) {
      this.watchCallbacks[propName](val);
    }
  }
}

module.exports = {
  settingsStore
};
