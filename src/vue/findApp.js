const {findToolbar} = require('./components/findToolbar.js');

let findApp = {
  el: '#findContent',

  data: {
    isEnabled: false,
    isVisible: true
  },

  methods: {
  },

  mounted() {
    this.findToolbar = this.$children[0];
  },

  components: {
    'find-toolbar': findToolbar,
  },
};

module.exports = {
  'findApp': findApp
}
