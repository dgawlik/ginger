
let buffer =  {
  data: function () {
    return {
      screen: undefined,
      lineWraps: true
    }
  },
  beforeMount () {
    window.addEventListener('wheel', this.onMouseWheel);
  },
  beforeDestroy () {
    window.removeEventListener('wheel', this.onMouseWheel);
  },
  mounted: function(){
    this.textBufferNode = document.querySelector('#textBuffer');
    this.linesWrapperNode = document.querySelector('#linesWrapper');
    this.lineNodes = [...document.querySelectorAll('#linesWrapper p')];
  },
  updated: function(){
    this.textBufferNode = document.querySelector('#textBuffer');
    this.linesWrapperNode = document.querySelector('#linesWrapper');
    this.lineNodes = [...document.querySelectorAll('#linesWrapper p')];
  },
  methods: {
    onMouseWheel(e){
      if(this.screen){
        let distance = settingsManager.scrollResolution;
        distance *= e.deltaY < 0 ? -1 : 1;
        let currentPos = this.screen.cursor;
        this.screen.update(currentPos + distance)
          .then(isUpdate => {
            if(isUpdate){
              this.forceUpdate();
            }
          });
      }
    },

    updateToRandomPosition(newPosition){
      this.screen.readRandomAt(newPosition)
        .then(() => {
          this.forceUpdate();
        });
    },

    updateScreen(){
      if(this.screen){
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
        let offset = this.screen.cursor - this.screen.boundaryLow;
        this.linesWrapperNode.style.top = -offsets[offset] + 'px';
      }
    },

    forceUpdate(){
      this.$forceUpdate();
      Vue.nextTick(() => this.updateScreen());
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
}
