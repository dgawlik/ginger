const {tabs} = require('./components/tabs.js');
const {buffer} = require('./components/buffer.js');
const {scrollbar} = require('./components/scrollbar.js');
const {settings} = require('./components/settings.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');
const {settingsStore} = require('./settingsStore.js');
const {dialog} = require('./dialogApp.js');

let mainApp = {
  el: '#content',

  data: {
    display: 'buffer'
  },

  components: {
    tabs,
    buffer,
    scrollbar,
    settings
  },

  mounted () {
    eventBus.$on('app/displayVirtual', name => this.displayVirtual(name));
    eventBus.$on('app/displayBuffer', screen => this.displayBuffer(screen));
    eventBus.$on('app/displayEmpty', () => this.displayEmpty());

    settingsStore.watch('wrapLines', val => this.changeWrapping(val));

    this.tabs = this.$children[0];
    this.buffer = this.$children[1];
    this.scrollbar = this.$children[2];
  },

  methods: {
    delegateStopDrag () {
      eventBus.$emit('scrollbar/stopDrag');
    },

    delegateMouseMove (e) {
      eventBus.$emit('scrollbar/mouseMove', e);
    },

    delegateChangePage (isUp) {
      eventBus.$emit('buffer/changePage', isUp);
    },

    changeWrapping (val) {
      eventBus.$emit('tabs/changeWrap', val);
    },

    findKeyDown () {
      eventBus.$emit('findApp/keyDown');
    },

    closeDialog () {
      dialog.hide();
      eventBus.$emit('findApp/closeKeyDown');
    },

    displayVirtual (name) {
      this.display = name;
      this.scrollbar.isVisible = false;
    },

    displayBuffer (screen) {
      this.display = 'buffer';
      this.buffer.screen = screen;
      this.scrollbar.isVisible = true;
      this.buffer.forceUpdate();
    },

    displayEmpty () {
      this.scrollbar.isVisible = false;
      this.display = 'buffer';
      this.buffer.screen = undefined;
      this.buffer.forceUpdate();
    },

    showColorize () {
      if (this.display === 'buffer') {
        dialog.show('colorize');
        eventBus.$emit('colorize/populate', this.tabs.getActiveTab().colors);
      }
    },

    showGotoLine () {
      if (this.display === 'buffer') {
        dialog.show('goto-line');
      }
    }
  }
};

let app = new Vue(mainApp);

module.exports = {
  app
};
