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

  mounted() {
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
    addTab(tab){
      Vue.set(this.tabs, tab.name, tab);
      this.setTab(tab);
    },

    getActiveTab(){
      return this.tabs[this.activeTabName];
    },

    setTab(tab){
      let previousTab;
      if (this.activeTabName && this.tabs[this.activeTabName]){
        previousTab = this.tabs[this.activeTabName];
        previousTab.offset = window.app.buffer.topLine;
        previousTab.isActive = false;
      }

      this.activeTabName = tab.name;
      Vue.set(tab, 'isActive', true);
      if (tab.isVirtual) {
        window.app.display = this.virtualNameToComponent[tab.name];
        window.app.scrollbar.isVisible = false;
        window.findToolbar.isValid = false;
      }
      else {
        window.app.display = 'buffer';
        let screen = window.tabManager.tabs[tab.name].screen;
        window.app.buffer.screen = screen;
        window.app.scrollbar.isVisible = true;
        window.findToolbar.isValid = true;

        if (this.wrappingCbk) {
          this.wrappingCbk();
          this.wrappingCbk = undefined;
        }
        window.app.buffer.forceUpdate();
      }
      eventBus.$emit('tabs/changeActiveTab', this.tabs[this.activeTabName]);
    },

    activateTab(name){
      let tab = this.tabs[name];
      if (tab) {
        this.setTab(tab);
      }
    },

    closeTab(name){
      delete this.tabs[name];
      window.tabManager.removeTab(name);

      let firstTab = Object.keys(this.tabs)[0];
      if (firstTab) {
        this.setTab(this.tabs[firstTab]);
      }
      else {
        window.app.scrollbar.isVisible = false;
        window.findToolbar.isValid = false;
        window.app.buffer.screen = undefined;
        window.app.tabs.$forceUpdate();
        window.app.buffer.forceUpdate();
      }
    },

    changeWrapping(val){
      this.wrappingCbk = () => {
        eventBus.$emit('buffer/changeWrap', val);
      };
    }
  }
};

module.exports = {
  'tabs' : tabs
};
