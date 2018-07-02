const {eventBus} = require('../eventBus.js');
const {Vue} = require('../vue.js');

let buffer =  {
  data: function () {
    return {
      screen: undefined,
      lineWraps: true
    };
  },

  beforeMount () {
    window.addEventListener('wheel', this.onMouseWheel);
  },

  beforeDestroy () {
    window.removeEventListener('wheel', this.onMouseWheel);
  },

  mounted () {
    eventBus.$on('buffer/changePage', isUp => this.changePage(isUp));
    eventBus.$on('buffer/changeWrap', val => this.lineWraps = val);
    eventBus.$on('settingsManager/changeScrollResolution', val => this.scrollResolution = val);
    eventBus.$on('buffer/updateToRandomPosition', val => this.updateToRandomPosition(val));
  },

  updated: function(){
    this.textBufferNode = document.querySelector('#textBuffer');
    this.linesWrapperNode = document.querySelector('#linesWrapper');
    this.lineNodes = [...document.querySelectorAll('#linesWrapper p')];
  },

  methods: {
    onMouseWheel(e){
      if(this.screen){
        let distance = this.scrollResolution || 1;
        distance *= e.deltaY < 0 ? -1 : 1;
        let currentPos = this.screen.cursor;

        return this.screen.update(currentPos + distance)
          .then(isUpdate => {
            if(
              isUpdate == 'loaded' ||
              isUpdate == 'cursor-moved'
            ){
              this.forceUpdate(isUpdate == 'loaded');
            }
          });
      }
    },

    updateToRandomPosition(newPosition){
      this.screen
        .readRandomAt(newPosition)
        .then(() => this.forceUpdate());
    },

    updateScreen(){
      if(this.screen){

        let offsets = this.calculateLineOffsets();
        let offset = this.screen.cursor - this.screen.boundaryLow;
        this.linesWrapperNode.style.top = -offsets[offset] + 'px';
      }
    },

    forceUpdate(isPageLoaded){
      if(isPageLoaded){
        this.$forceUpdate();
      }
      Vue.nextTick(() => {
        this.updateScreen();
      });
    },

    changePage(isUp){
      let offsets = this.calculateLineOffsets(),
        currentToplineOffset = -parseInt(this.linesWrapperNode.style.top.replace('px', ''));

      if (isUp) {
        let topLineIt = currentToplineOffset,
          prevTopLine = this.screen.cursor;

        for(
          let i = this.screen.cursor;
          i > 0;
          i--
        ){
          topLineIt = offsets[i-this.screen.boundaryLow-1];
          if(!this.checkIsLineCurrentlyOnScreen(offsets, prevTopLine, topLineIt)){
            this.updateToRandomPosition(i);
            return;
          }
          else if (topLineIt === 0) {
            this.updateToRandomPosition(0);
          }
        }
      }
      else {
        for(
          let i = this.screen.cursor;
          i < this.screen.boundaryHigh;
          i++
        ){
          if(!this.checkIsLineCurrentlyOnScreen(offsets, i, currentToplineOffset)){
            this.updateToRandomPosition(i);
            return;
          }
        }
      }
    },

    checkIsLineCurrentlyOnScreen(offsets, lineNo, topLineOffset){
      //we want ensure whole line is visible
      let offset = lineNo - this.screen.boundaryLow + 1,
        screenHeight = this.textBufferNode.getBoundingClientRect().height;

      if (
        offset == offsets.length ||
        (
          offsets[offset] - topLineOffset < screenHeight &&
          offsets[offset-1] - topLineOffset >= 0
        )
      ){
        return true;
      }
      else {
        return false;
      }
    },

    calculateLineOffsets(){
      let lineNodeHeights = this.lineNodes.map(e => {
        const propValue = prop =>
          parseInt(window.getComputedStyle(e).getPropertyValue(prop));

        return e.offsetHeight + propValue('margin-top')
          + propValue('margin-bottom');
      });

      let offsets = new Array(lineNodeHeights.length);
      offsets[0] = 0;
      for(let i=1;i<offsets.length;i++){
        offsets[i] = offsets[i-1]+lineNodeHeights[i-1];
      }
      return offsets;
    }
  },

  computed: {
    linesWithNumbers: function(){
      if(!this.screen){
        return [];
      }

      let arr = [];
      for(let i=0;i<this.screen.boundaryHigh-this.screen.boundaryLow;i++){
        arr.push({
          'lineNo': i+this.screen.boundaryLow,
          'line': this.screen.lines[i]
        });
      }

      return arr;
    },
    noWrap: function(){
      return !this.lineWraps;
    }
  },

  template: `<div id="textBuffer">
<div id="linesWrapper">
  <p :key="entry.lineNo"
      v-for="entry in linesWithNumbers"
      v-bind:class="{'no-wrap': noWrap, 'textBufferLine': true}">
    <span class="lineNumber">{{entry.lineNo}}</span>
    {{entry.line}}
  </p>
</div>
</div>`
};

module.exports = {
  'buffer': buffer
};
