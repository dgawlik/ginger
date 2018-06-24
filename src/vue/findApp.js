const {findToolbar} = require('./components/findToolbar.js');

let findApp = {
  el: '#findContent',

  data: {
    isValid: false,
    isShow: false
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
