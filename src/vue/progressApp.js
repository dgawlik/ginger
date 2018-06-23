const {progressDialog} = require('./components/progressDialog.js');

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
    this.overlayNode = document.querySelector('#overlay');
    this.modalNode = document.querySelector('#dialog');
    this.dialog = this.$children[0];
  },
  
  components: {
    'progress-dialog': progressDialog,
  },
};

module.exports = {
  'progressApp': progressApp
}
