const {tab} = require('./src/vue/components/tab.js');
const {tabs} = require('./src/vue/components/tabs.js');
const {buffer} = require('./src/vue/components/buffer.js');
const {progressDialog} = require('./src/vue/components/progressDialog.js');
const {scrollbar} = require('./src/vue/components/scrollbar.js');
const {settings} = require('./src/vue/components/settings.js');

window.progressBar = new Vue({
  el: '#progressContent',
  data: {
  },
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
});

window.app = new Vue({
  el: '#content',
  data: {
    message: 'Hello Vue!',
    tabs: {},
    display: 'buffer'
  },
  components: {
    'tabs': tabs,
    'buffer': buffer,
    'scrollbar': scrollbar,
    'settings': settings
  },
  mounted(){
    this.buffer = this.$children[1];
    this.scrollbar = this.$children[2];
    this.tabOffsets = {};
    this.virtualNameToComponent = {
      '<Settings>': 'settings'
    }
  },
  methods: {
    delegateStopDrag(){
      if(this.scrollbar.doDrag){
        this.scrollbar.doDrag = false;
      }
    },
    delegateMouseMove(e){
      if(this.scrollbar.doDrag){
        this.scrollbar.onMouseMove(e);
      }
    },
    updateScreenOnScroll(currentCursor){
      let screen = tabManager.tabs[this.activeTabName].screen;
      let totalLines = screen.file.lineBeginnings.length;
      let newOffset = parseInt(totalLines*currentCursor);
      screen.readRandomAt(newOffset)
        .then(() => {
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, screen.boundaryLow);
        });
    },
    addTab(tab){
      Vue.set(this.tabs, tab.name, tab);
      this.setTab(tab);
    },
    setTab(tab){
      let previousTab;
      if(this.activeTabName && this.tabs[this.activeTabName]){
        previousTab = this.tabs[this.activeTabName];
        previousTab.offset = this.buffer.topLine;
        previousTab.isActive = false;
      }

      this.activeTabName = tab.name;
      Vue.set(tab, 'isActive', true);
      if(tab.isVirtual){
        this.display = this.virtualNameToComponent[tab.name];
      }
      else {
        this.display = 'buffer';
        let screen = tabManager.tabs[tab.name].screen;
        this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, tab.offset, true);
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
        this.buffer.update([], 0, 0);
      }
    },
    loadNextPage(){
      let screen = tabManager.tabs[this.activeTabName].screen;
      let promise = screen.readNextPage();
      promise.then((function(){
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.buffer.topLine);
        }).bind(this));
      return promise;
    },
    loadPrevPage(){
      let screen = tabManager.tabs[this.activeTabName].screen;
      let promise = screen.readPrevPage();
      promise.then((function(){
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.buffer.topLine);
        }).bind(this));
      return promise;
    }
  }
});

window.settingsManager = {
  scrollResolution: 1,
  setSoftLineWraps(val){
    app.buffer.softLineWraps = val;
    app.buffer.update([], 0, 0, 0);
  }
};
