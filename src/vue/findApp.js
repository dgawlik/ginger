const {findToolbar} = require('./components/findToolbar.js');
const {eventBus} = require('./eventBus.js');

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

    eventBus.$on('findApp/keyDown', () => this.isShow = true);
    eventBus.$on('findApp/closeKeyDown', () => this.isShow = false);
  },

  components: {
    'find-toolbar': findToolbar,
  },
};

module.exports = {
  'findApp': findApp
}
