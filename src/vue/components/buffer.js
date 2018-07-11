const {eventBus} = require('../eventBus.js');
const {Vue} = require('../vue.js');
const {settingsStore} = require('../settingsStore.js');

let buffer =  {
  data () {
    return {
      screen: undefined,
      lineWraps: true,
      mode: 'normal',
      filters: []
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
    eventBus.$on('buffer/updateToRandomPosition', val => this.updateToRandomPosition(val));
    eventBus.$on('findApp/closeKeyDown', () => this.switchToNormalMode());
    eventBus.$on('findApp/highlight', val => this.switchToFindMode(val));
    eventBus.$on('findApp/next', () => this.findNext());
    eventBus.$on('findApp/prev', () => this.findPrev());
    eventBus.$on('colorize/update', filters => this.colorizeUpdate(filters));
    eventBus.$on('gotoline/go', val => this.updateToRandomPosition(+val));
  },

  updated () {
    this.textBufferNode = document.querySelector('#textBuffer');
    this.linesWrapperNode = document.querySelector('#linesWrapper');
    this.lineNodes = [...document.querySelectorAll('#linesWrapper p')];
  },

  methods: {
    onMouseWheel (e) {
      if (this.screen) {
        let distance = settingsStore.state.scrollResolution;
        distance *= e.deltaY < 0 ? -1 : 1;
        let currentPos = this.screen.cursor;

        return this.screen.update(currentPos + distance)
          .then(isUpdate => {
            if (
              isUpdate === 'loaded' ||
              isUpdate === 'cursor-moved'
            ) {
              console.log(this.screen.boundaryLow, this.screen.boundaryHigh);
              this.forceUpdate(isUpdate === 'loaded');
            }
          });
      }
    },

    updateToRandomPosition (newPosition) {
      return this.screen
        .readRandomAt(newPosition)
        .then(() => this.forceUpdate());
    },

    updateScreen () {
      if (this.screen) {
        let offsets = this.calculateLineOffsets();
        let offset = this.screen.cursor - this.screen.boundaryLow;
        this.linesWrapperNode.style.top = -offsets[offset] + 'px';
      }
    },

    forceUpdate (isPageLoaded) {
      return new Promise(function (resolve) {
        if (isPageLoaded) {
          this.$forceUpdate();
        }
        Vue.nextTick(() => {
          this.updateScreen();
          resolve();
        });
      }.bind(this));
    },

    changePage (isUp) {
      let offsets = this.calculateLineOffsets(),
        currentToplineOffset = -this.linesWrapperNode.style.top.replace('px', '');

      if (isUp) {
        let topLineIt = currentToplineOffset,
          prevTopLine = this.screen.cursor;

        for (
          let i = this.screen.cursor;
          i > 0;
          i--
        ) {
          topLineIt = offsets[i-this.screen.boundaryLow-1];
          if (!this.checkIsLineCurrentlyOnScreen(offsets, prevTopLine, topLineIt)) {
            this.updateToRandomPosition(i);
            return;
          }
          else if (topLineIt === 0) {
            this.updateToRandomPosition(0);
          }
        }
      }
      else {
        for (
          let i = this.screen.cursor;
          i < this.screen.boundaryHigh;
          i++
        ) {
          if (!this.checkIsLineCurrentlyOnScreen(offsets, i, currentToplineOffset)) {
            this.updateToRandomPosition(i);
            return;
          }
        }
      }
    },

    checkIsLineCurrentlyOnScreen (offsets, lineNo, topLineOffset) {
      //we want ensure whole line is visible
      let offset = lineNo - this.screen.boundaryLow + 1,
        screenHeight = this.textBufferNode.getBoundingClientRect().height;

      if (
        offset === offsets.length ||
        (
          offsets[offset] - topLineOffset < screenHeight &&
          offsets[offset-1] - topLineOffset >= 0
        )
      ) {
        return true;
      }
      else {
        return false;
      }
    },

    calculateLineOffsets () {
      let lineNodeHeights = this.lineNodes.map(e => {
        const propValue = prop =>
          parseInt(window.getComputedStyle(e).getPropertyValue(prop));

        return e.offsetHeight + propValue('margin-top')
          + propValue('margin-bottom');
      });

      let offsets = new Array(lineNodeHeights.length);
      offsets[0] = 0;
      for (let i=1;i<offsets.length;i++) {
        offsets[i] = offsets[i-1]+lineNodeHeights[i-1];
      }
      return offsets;
    },

    postprocessLine (lineNo, text) {
      if (this.mode !== 'find') {
        return text;
      }
      lineNo = +lineNo;

      let matchLength = this.findText.length;

      let idx;
      if ((idx = this.findMatches.lineToIndex.get(lineNo)) !== undefined && text) {
        let lineSnapshot = this.findMatches.lines[idx],
          offset = 0;
        const isActiveHighlight =
          (line, pos) => line ===  this.findMatches.lines[this.findMatchesIt] &&
            pos === this.findMatches.positions[this.findMatchesIt];

        do {
          let position = this.findMatches.positions[idx];

          let header = text.slice(0, position+offset),
            trailer = text.slice(position+matchLength+offset),
            token = text.slice(position+offset, position+matchLength+offset),
            modification = isActiveHighlight(lineNo, position) ?
              `<span class='highlight-active'>${token}</span>` :
              `<span class='highlight'>${token}</span>`;

          text = header + modification + trailer;
          offset += isActiveHighlight(lineNo, position) ? 38 : 31;
        }
        while (this.findMatches.lines[++idx] === lineSnapshot);
        return text;
      }
      else {
        return text;
      }
    },

    switchToFindMode ({matches, text}) {
      this.findMatches = matches;
      this.findText = text;
      this.findMatchesIt = 0;
      this.mode = 'find';
      this.followActiveHighlight(this.findMatchesIt);
    },

    findNext () {
      let len = this.findMatches.lines.length;
      this.findMatchesIt = this.findMatchesIt === len - 1 ?
        0 : this.findMatchesIt + 1;
      this.followActiveHighlight(this.findMatchesIt);
      this.$forceUpdate();
    },

    findPrev () {
      let len = this.findMatches.lines.length;
      this.findMatchesIt = this.findMatchesIt === 0 ?
        len - 1 : this.findMatchesIt - 1;
      let promise = this.followActiveHighlight(this.findMatchesIt);
      if (promise) {
        this.changePage(true);
      }
      this.$forceUpdate();
    },

    switchToNormalMode () {
      this.mode = 'normal';
      this.$forceUpdate();
    },

    followActiveHighlight (idx) {
      let line = this.findMatches.lines[idx];

      let shouldAlign =
        (line < this.screen.boundaryLow || line > this.screen.boundaryHigh) ||
        !this.checkIsLineCurrentlyOnScreen(
          this.calculateLineOffsets(), line,
          -this.linesWrapperNode.style.top.replace('px', ''));

      if (shouldAlign) {
        return this.updateToRandomPosition(line);
      }
    },

    colorizeUpdate (filters) {
      this.filters = filters;
    },

    classObject (text) {
      let o = {
        'no-wrap': !this.lineWraps,
        'textBufferLine': true
      };

      for (let filter of this.filters) {
        let r = new RegExp(filter.pattern);
        o['palette-'+filter.color] = r.test(text);
      }

      return o;
    }
  },

  computed: {
    linesWithNumbers () {
      if (!this.screen) {
        return [];
      }

      let arr = [];
      for (
        let i=0;
        i<this.screen.boundaryHigh-this.screen.boundaryLow;
        i++
      ) {
        arr.push({
          'lineNo': i+this.screen.boundaryLow,
          'line': this.screen.lines[i]
        });
      }

      return arr;
    }
  },

  template: `<div id="textBuffer">
<div id="linesWrapper">
  <p
   v-for="entry in linesWithNumbers"
   :key="entry.lineNo"
   v-bind:class="classObject(entry.line)">
    <span class="lineNumber">{{entry.lineNo}}</span>
    <span
      style="display:inline-block"
      v-html="postprocessLine(entry.lineNo, entry.line)"
    ></span>
  </p>
</div>
</div>`
};

module.exports = {
  buffer
};
