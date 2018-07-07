const {findToolbar} = require('./components/findToolbar.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');

let findApp = {
  el: '#findContent',

  data: {
    isValid: false,
    isShow: false
  },

  methods: {
  },

  mounted () {
    this.findToolbar = this.$children[0];

    eventBus.$on('findApp/keyDown', () => {
      this.isShow = true;
    });
    eventBus.$on('findApp/closeKeyDown', () => this.isShow = false);
    eventBus.$on('findApp/changeValid', val => this.isValid = val);
  },

  components: {
    'find-toolbar': findToolbar,
  },
};

let findToolbar_ = new Vue(findApp);

module.exports = {
  'findToolbar': findToolbar_
};
