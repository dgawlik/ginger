const {elementOuterHeight} = require('../../util.js');

let buffer =  {
  data: function () {
    return {
      lines: [],
      boundaryLow: 0,
      boundaryHigh: 0,
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
    this.queue = [];
  },
  updated: function(){
    this.textBufferNode = document.querySelector('#textBuffer');
    this.linesWrapperNode = document.querySelector('#linesWrapper');
    this.lineNodes = [...document.querySelectorAll('#linesWrapper p')];
    if(!this.topLine){
      this.topLine = 0;
    }
    else {
      this.alignToLine(this.topLine);
    }
  },
  methods: {
    update(lines, boundaryLow, boundaryHigh, topLine, forceUpdate){
      if(forceUpdate || boundaryLow != this.boundaryLow || boundaryHigh != this.boundaryHigh){
        this.lines = lines;
        this.boundaryLow = boundaryLow;
        this.boundaryHigh = boundaryHigh;
        this.topLine = topLine;
        if(topLine){
          this.alignToLine(topLine);
        }
        else {
          try {
            this.alignToLine(0);
          }
          catch(ex){

          }
        }
      }
    },
    alignToLine(lineNo){
      let index;
      index = lineNo - this.boundaryLow;
      let node = this.lineNodes[index];
      let offset = node.offsetTop || 0;
      this.setWrapperVerticalPosition(-offset);
    },

    onMouseWheel(e){
      if(this.lines.length){
        let lastLineNode = this.lineNodes[this.lineNodes.length-1];
        let viewportHeight = window.getComputedStyle(this.textBufferNode)
              .height.replace('px', '');
        viewportHeight = parseInt(viewportHeight);
        if(lastLineNode.offsetTop + this.linesWrapperOffset < viewportHeight && e.deltaY > 0){
          app.loadNextPage();
          return;
        }
        if(this.topLine == this.boundaryLow && e.deltaY < 0 && this.boundaryLow != 0){
          app.loadPrevPage();
          return;
        }

        if(e.deltaY < 0){
          if(this.topLine > 0){
            let dy = Math.min(settingsManager.scrollResolution, this.topLine-this.boundaryLow);
            if(this.topLine - dy < this.boundaryLow){
              app.loadPrevPage().then(()=>{
                this.topLine -= dy;
                this.alignToLine(this.topLine);
              });
            }
            else {
              this.topLine -= dy;
              this.alignToLine(this.topLine);
            }

          }
        }
        else {
          let dy = Math.min(settingsManager.scrollResolution, this.boundaryHigh-this.topLine);
          if(this.topLine + dy >= this.boundaryHigh){
            app.loadNextPage().then(() => {
              this.topLine += dy;
              this.alignToLine(this.topLine);
            });
          }
          else {
            this.topLine += dy;
            this.alignToLine(this.topLine);
          }
        }
      }
    },
    setWrapperVerticalPosition(val){
      this.linesWrapperNode.style.top = val + 'px';
      this.linesWrapperOffset = val;
    }
  },
  computed: {
    linesWithNumbers: function(){
      let arr = [];
      for(let i=0;i<this.boundaryHigh-this.boundaryLow;i++){
        arr.push({
          'lineNo': i+this.boundaryLow,
          'line': this.lines[i]
        });
      }
      return arr;
    }
  },
  template: `<div id="textBuffer">
<div id="linesWrapper">
  <p :key="entry.lineNo" class="textBufferLine" v-for="entry in linesWithNumbers">
    <span class="lineNumber">{{entry.lineNo}}</span>
    {{entry.line}}
  </p>
</div>
</div>`
};

module.exports = {
  'buffer': buffer
}
