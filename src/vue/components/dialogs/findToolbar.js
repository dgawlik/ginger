const {eventBus} = require('../../eventBus.js');
const {dialog} = require('../../dialogApp.js');

class $1 {
  progress (val) {
    eventBus.$emit('progressBar/updateProgress', val);
  }
}

let findToolbar =  {
  props: ['isValid', 'isShow'],

  data () {
    return {
      findText: ''
    };
  },

  mounted () {
    eventBus.$on('tabs/changeActiveTab', val => this.triggeringTab = val);
  },

  updated () {
    if (this.isValid && this.isShow) {
      document.querySelector('#findToolbarInput').focus();
    }
  },

  methods: {
    onClose () {
      window.findToolbar.isShow = false;
      eventBus.$emit('findApp/closeKeyDown');
    },

    onSearch () {
      dialog.show('progress-component');
      this.triggeringTab && this.findText && this.triggeringTab.screen.file
        .find(this.findText, new $1())
        .then(matches => {
          dialog.hide();
          if (matches.lines.length) {
            eventBus.$emit('findApp/highlight', {matches, 'text': this.findText});
          }
        });
    },

    onPrev () {
      eventBus.$emit('findApp/prev');
    },

    onNext () {
      eventBus.$emit('findApp/next');
    }
  },

  template: `
<div v-if="isValid && isShow" id="findToolbar">
  <input type="text" id="findToolbarInput" v-model="findText">
  <i
   class="fas fa-angle-left"
   @click="onPrev"
  ></i>
  <i
   class="fas fa-angle-right"
   @click="onNext"
  ></i>
  <button id="findToolbarSearch" @click="onSearch">
    <i class="fas fa-search"></i>
    Search
  </button>
  <i @click="onClose" class="fas fa-times"></i>
</div>
`
};

module.exports = {
  findToolbar
};
