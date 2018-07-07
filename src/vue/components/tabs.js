const {tab} = require('./tab.js');
const {eventBus} = require('../eventBus.js');
const {Vue} = require('../vue.js');

let tabs =  {
  data: function () {
    return {
      tabs: {}
    };
  },

  template: '<div class="tabs"><tab v-for="tabAttr in Object.values(tabs)" :key="tabAttr.name" :name="tabAttr.name" :isActive="tabAttr.isActive"></tab></div>',

  components: {
    'tab': tab,
  },

  mounted () {
    eventBus.$on('tabs/changeWrap', val => this.changeWrapping(val));
    eventBus.$on('tabs/activateTab', name => this.activateTab(name));
    eventBus.$on('tabs/closeTab', name => this.closeTab(name));
    eventBus.$on('tabs/addTab', tab => this.addTab(tab));
    eventBus.$on('tabs/queryActiveTab', () => {
      eventBus.$emit('findToolbar/pushActiveTab', this.getActiveTab());
    });

    this.virtualNameToComponent = {
      '<Settings>': 'settings'
    };
  },

  methods: {
    addTab (tab) {
      Vue.set(this.tabs, tab.name, tab);
      this.setTab(tab);
    },

    getActiveTab () {
      return this.tabs[this.activeTabName];
    },

    setTab (tab) {
      let previousTab;
      if (this.activeTabName && this.tabs[this.activeTabName]) {
        previousTab = this.tabs[this.activeTabName];
        previousTab.isActive = false;
      }

      this.activeTabName = tab.name;
      Vue.set(tab, 'isActive', true);
      if (tab.isVirtual) {
        eventBus.$emit('app/displayVirtual', this.virtualNameToComponent[tab.name]);
        eventBus.$emit('findApp/changeValid', false);
      }
      else {
        let screen = window.tabManager.tabs[tab.name].screen;
        eventBus.$emit('app/displayBuffer', screen);
        eventBus.$emit('findApp/changeValid', true);

        if (this.wrappingCbk) {
          this.wrappingCbk();
          this.wrappingCbk = undefined;
        }
      }
      eventBus.$emit('tabs/changeActiveTab', this.tabs[this.activeTabName]);
    },

    activateTab (name) {
      let tab = this.tabs[name];
      if (tab) {
        this.setTab(tab);
      }
    },

    closeTab (name) {
      delete this.tabs[name];
      window.tabManager.removeTab(name);

      let firstTab = Object.keys(this.tabs)[0];
      if (firstTab) {
        this.setTab(this.tabs[firstTab]);
      }
      else {
        this.$forceUpdate();
        eventBus.$emit('findApp/changeValid', false);
        eventBus.$emit('app/displayEmpty');
      }
    },

    changeWrapping (val) {
      this.wrappingCbk = () => {
        eventBus.$emit('buffer/changeWrap', val);
      };
    }
  }
};

module.exports = {
  'tabs' : tabs
};
