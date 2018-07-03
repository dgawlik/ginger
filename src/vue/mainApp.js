const {tabs} = require('./components/tabs.js');
const {buffer} = require('./components/buffer.js');
const {scrollbar} = require('./components/scrollbar.js');
const {settings} = require('./components/settings.js');
const {eventBus} = require('./eventBus.js');
const {Vue} = require('./vue.js');

let mainApp = {
  el: '#content',

  data: {
    message: 'Hello Vue!',
    display: 'buffer'
  },

  components: {
    'tabs': tabs,
    'buffer': buffer,
    'scrollbar': scrollbar,
    'settings': settings
  },

  mounted(){
    eventBus.$on('app/changeWrap', val => this.changeWrapping(val));
    eventBus.$on('app/displayVirtual', name => this.displayVirtual(name));
    eventBus.$on('app/displayBuffer', screen => this.displayBuffer(screen));
    eventBus.$on('app/displayEmpty', () => this.displayEmpty());

    this.tabs = this.$children[0];
    this.buffer = this.$children[1];
    this.scrollbar = this.$children[2];
  },

  methods: {
    delegateStopDrag(){
      eventBus.$emit('scrollbar/stopDrag');
    },

    delegateMouseMove(e){
      eventBus.$emit('scrollbar/mouseMove', e);
    },

    delegateChangePage(isUp){
      eventBus.$emit('buffer/changePage', isUp);
    },

    changeWrapping(val){
      eventBus.$emit('tabs/changeWrap', val);
    },

    findKeyDown(){
      eventBus.$emit('findApp/keyDown');
    },

    closeFindKeyDown(){
      eventBus.$emit('findApp/closeKeyDown');
    },

    displayVirtual(name){
      this.display = name;
      this.scrollbar.isVisible = false;
    },

    displayBuffer(screen){
      this.display = 'buffer';
      this.buffer.screen = screen;
      this.scrollbar.isVisible = true;
      this.buffer.forceUpdate();
    },

    displayEmpty(){
      this.scrollbar.isVisible = false;
      this.buffer.screen = undefined;
      this.buffer.forceUpdate();
    }
  }
};

let app = new Vue(mainApp);

module.exports = {
  'app': app
};
