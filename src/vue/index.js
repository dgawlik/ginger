const {tab} = require('./src/vue/components/tab.js');
const {tabs} = require('./src/vue/components/tabs.js');
const {buffer} = require('./src/vue/components/buffer.js');
const {progressDialog} = require('./src/vue/components/progressDialog.js');
const {scrollbar} = require('./src/vue/components/scrollbar.js');

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
    tabs: []
  },
  components: {
    'tabs': tabs,
    'buffer': buffer,
    'scrollbar': scrollbar
  },
  mounted(){
    this.buffer = this.$children[1];
    this.scrollbar = this.$children[2];
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
      let screen = tabManager.tabs[this.activeTab].screen;
      let totalLines = screen.file.lineBeginnings.length;
      let newOffset = parseInt(totalLines*currentCursor);
      screen.readRandomAt(newOffset)
        .then(() => {
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, screen.boundaryLow);
        });
    },
    addTab(tab){
      this.tabs.push(tab);
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
        this.activeTab = tab.name;
        let screen = tabManager.tabs[tab.name].screen;
        this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh);
      }
    },
    activateTab(name){
      let tab = this.tabs.filter(t => t.name == name)[0];
      if(tab){
        this.setTab(tab);
      }
    },
    closeTab(name){
      let ind = this.tabs.findIndex(t=>t.name==name);
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
      let screen = tabManager.tabs[this.activeTab].screen;
      screen.readNextPage()
        .then((function(){
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.buffer.topLine);
        }).bind(this));
    },
    loadPrevPage(){
      let screen = tabManager.tabs[this.activeTab].screen;
      screen.readPrevPage()
        .then((function(){
          this.buffer.update(screen.lines, screen.boundaryLow, screen.boundaryHigh, this.buffer.topLine);
        }).bind(this));

    }
  }
})
