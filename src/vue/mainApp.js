const {tabs} = require('./components/tabs.js');
const {buffer} = require('./components/buffer.js');
const {scrollbar} = require('./components/scrollbar.js');
const {settings} = require('./components/settings.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');
const {settingsStore} = require('./settingsStore.js');
const {dialog} = require('./dialogApp.js');
const {findToolbar} = require('./findApp.js');

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

    document.addEventListener('keydown', (e) => {
      if (e.code === 'PageDown') {
        this.delegateChangePage(true);
      }
      if (e.code === 'PageUp') {
        this.delegateChangePage(false);
      }
      if (e.code === 'ArrowUp') {
        this.moveUp();
      }
      if (e.code === 'ArrowDown') {
        this.moveDown();
      }
      if (e.code === 'Escape') {
        this.closeDialog();
      }
      if (e.code === 'KeyF' && e.ctrlKey === true) {
        this.findKeyDown();
      }
      if (e.code === 'KeyX' && e.ctrlKey === true) {
        this.showColorize();
      }
      if (e.code === 'KeyM' && e.ctrlKey === true) {
        this.showBookmarks();
      }
      if (e.code === 'KeyO' && e.ctrlKey === true) {
        this.showOpen();
      }
      if (e.code === 'KeyS' && e.ctrlKey === true) {
        this.showSettings();
      }
      if (e.code === 'KeyG' && e.ctrlKey === true) {
        this.showGotoLine();
      }
      if (e.code === 'Enter') {
        this.onEnter();
      }
    });
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
      if (this.display === 'buffer'
        && Object.keys(this.tabs.tabs).length) {
        dialog.show('colorize');
        eventBus.$emit('colorize/populate', this.tabs.getActiveTab().colors);
      }
    },

    showGotoLine () {
      if (this.display === 'buffer') {
        dialog.show('goto-line');
      }
    },

    moveUp () {
      eventBus.$emit('buffer/moveup');
    },

    moveDown () {
      eventBus.$emit('buffer/movedown');
    },

    showBookmarks () {
      if (this.display === 'buffer'
        && Object.keys(this.tabs.tabs).length) {
        dialog.show('bookmarks');
        eventBus.$emit('bookmarks/populate', this.tabs.getActiveTab().bookmarks);
      }
    },

    showOpen () {
      window.onOpen();
    },

    showSettings () {
      window.onSettings();
    },

    onEnter () {
      if (findToolbar.isShow) {
        findToolbar.findToolbar.onSearch();
      }
    }
  }
};

let app = new Vue(mainApp);

module.exports = {
  app
};
