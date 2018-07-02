const {progressDialog} = require('./components/progressDialog.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');

let progressApp = {
  el: '#progressContent',

  methods: {
    show(){
      this.overlayNode.style.display = 'block';
      this.modalNode.style.display = 'block';
    },

    hide() {
      this.overlayNode.style.display = 'none';
      this.modalNode.style.display = 'none';
    },

    updateProgress(val){
      this.dialog.update(val);
    }
  },

  mounted() {
    eventBus.$on('progressBar/updateProgress', val => this.updateProgress(val));
    eventBus.$on('progressBar/show', () => this.show());
    eventBus.$on('progressBar/hide', () => this.hide());

    this.overlayNode = document.querySelector('#overlay');
    this.modalNode = document.querySelector('#dialog');
    this.dialog = this.$children[0];
  },

  components: {
    'progress-dialog': progressDialog,
  },
};

let progressBar = new Vue(progressApp);

module.exports = {
  'progressBar': progressBar
};
