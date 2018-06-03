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
    tabs: [],
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
      let activeTab = this.activeTab;
      let screen = tabManager.tabs[activeTab].screen;
      let totalLines = screen.file.lineBeginnings.length;
      let newOffset = parseInt(totalLines*currentCursor);
      screen.readRandomAt(newOffset)
        .then(() => {
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, screen.boundaryLow);
        });
    },
    addTab(tab){
      this.tabs.push(tab);
      this.tabOffsets[tab.name] = 0;
      this.setTab(tab);
    },
    setTab(tab){
      for(let i=0;i<this.tabs.length;i++){
        let cpy = Object.assign({}, this.tabs[i]);
        if(this.tabs[i].name == tab.name){
          cpy.isActive = true;
        }
        else {
          cpy.isActive = false;
        }
        this.$set(this.tabs, i, cpy);

        if(this.activeTab){
          this.tabOffsets[this.activeTab] = this.buffer.topLine;
        }

        if(tab.name.startsWith("<")){
          this.setVirtualTab(tab);
        }
        else {
          this.setBufferTab(tab);
        }
      }
    },
    setBufferTab(tab){
      this.display = 'buffer';

      this.activeTab = tab.name;
      let screen = tabManager.tabs[tab.name].screen;
      this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.tabOffsets[tab.name], true);

    },
    setVirtualTab(tab){
      this.display = this.virtualNameToComponent[tab.name];
      this.activeTab = tab.name;
    },
    activateTab(name){
      let tab = this.tabs.filter(t => t.name == name)[0];
      if(tab){
        this.setTab(tab);
      }
    },
    closeTab(name){
      let ind = this.tabs.findIndex(t=>t.name==name);
      this.tabOffsets[this.tabs[ind].name] = 0;
      this.tabs = this.tabs.slice(0, ind).concat(this.tabs.slice(ind+1));
      tabManager.removeTab(name);
      let firstTab = this.tabs[0];
      if(firstTab){
        this.setTab(firstTab);
      }
      else {
        this.buffer.update([], 0, 0);
      }
    },
    loadNextPage(){
      let activeTab = this.activeTab;
      let screen = tabManager.tabs[activeTab].screen;
      let promise = screen.readNextPage();
      promise.then((function(){
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.buffer.topLine);
        }).bind(this));
      return promise;
    },
    loadPrevPage(){
      let activeTab = this.activeTab;
      let screen = tabManager.tabs[activeTab].screen;
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
