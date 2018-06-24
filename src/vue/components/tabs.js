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
        app.scrollbar.isVisible = false;
        findToolbar.isValid = false;
      }
      else {
        app.display = 'buffer';
        let screen = tabManager.tabs[tab.name].screen;
        app.buffer.screen = screen;
        app.scrollbar.isVisible = true;
        findToolbar.isValid = true;

        if(this.wrappingCbk){
          this.wrappingCbk();
          this.wrappingCbk = undefined;
        }
        app.buffer.forceUpdate();
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
        app.scrollbar.isVisible = false;
        findToolbar.isValid = false;
        app.buffer.screen = undefined;
        app.tabs.$forceUpdate();
        app.buffer.forceUpdate();
      }
    },

    changeWrapping(val){
      this.wrappingCbk = () => {
        app.buffer.lineWraps = val;
      };
    }
  }
};

module.exports = {
  'tabs' : tabs
}
