const {tab} = require('./tab.js');

let tabs =  {
  data: function () {
    return {
      tabs: {}
    }
  },
  template: '<div class="tabs"><tab v-for="tabAttr in Object.values(tabs)" :key="tabAttr.name" :name="tabAttr.name" :isActive="tabAttr.isActive"></tab></div>',
  components: {
    'tab': tab,
  },
  mounted() {
    this.virtualNameToComponent = {
      '<Settings>': 'settings'
    };
  },
  methods: {
    addTab(tab){
      Vue.set(this.tabs, tab.name, tab);
      this.setTab(tab);
    },
    setTab(tab){
      let previousTab;
      if(this.activeTabName && this.tabs[this.activeTabName]){
        previousTab = this.tabs[this.activeTabName];
        previousTab.offset = app.buffer.topLine;
        previousTab.isActive = false;
      }

      this.activeTabName = tab.name;
      Vue.set(tab, 'isActive', true);
      if(tab.isVirtual){
        app.display = this.virtualNameToComponent[tab.name];
      }
      else {
        app.display = 'buffer';
        let screen = tabManager.tabs[tab.name].screen;
        app.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, tab.offset, true);
      }
    },
    activateTab(name){
      let tab = this.tabs[name];
      if(tab){
        this.setTab(tab);
      }
    },
    closeTab(name){
      delete this.tabs[name];
      tabManager.removeTab(name);
      let firstTab = Object.keys(this.tabs)[0];
      if(firstTab){
        this.setTab(this.tabs[firstTab]);
      }
      else {
        app.buffer.update([], 0, 0);
      }
    },
  }
};

module.exports = {
  'tabs' : tabs
}
