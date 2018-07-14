const {progressComponent} = require('./components/dialogs/progressComponent.js');
const {colorize} = require('./components/dialogs/colorize.js');
const {gotoLine} = require('./components/dialogs/gotoLine.js');
const {bookmarks} = require('./components/dialogs/bookmarks.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');

let dialogApp = {
  el: '#dialog-content',

  data: {
    component: 'progress-component',
    isVisible: false
  },

  methods: {
    show (componentName) {
      this.overlayNode.style.display = 'block';
      this.modalNode.style.display = 'block';
      this.component = componentName;
      this.isVisible = true;
    },

    hide () {
      this.overlayNode.style.display = 'none';
      this.modalNode.style.display = 'none';
      this.isVisible = false;
    },
  },

  mounted () {
    this.overlayNode = document.querySelector('#dialog-overlay');
    this.modalNode = document.querySelector('#dialog-content');
    this.dialog = this.$children[0];

    eventBus.$on('dialog/close', () => this.hide());
  },

  components: {
    'progress-component': progressComponent,
    colorize,
    'goto-line': gotoLine,
    bookmarks
  },
};

let dialog = new Vue(dialogApp);

module.exports = {
  dialog
};
