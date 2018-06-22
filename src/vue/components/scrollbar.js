
let scrollbar =  {
  data: function () {
    return {
      cursor: 0
    }
  },
  mounted() {
    this.thumbNode = document.querySelector('.scrollbar .thumb');
    this.scrollbarNode = document.querySelector('.scrollbar');
    this.THUMB_HEIGHT = 30;
  },
  methods: {
    onMouseDown(e){
      e.preventDefault();
      this.doDrag = true;
      this.startingY = e.pageY;
      this.topY = this.scrollbarNode.getBoundingClientRect().top;
      this.bottomY = this.scrollbarNode.getBoundingClientRect().bottom;
      this.cursorY = this.thumbNode.getBoundingClientRect().top;
    },
    onMouseMove(e){
      let dy = e.pageY - this.startingY;
      newCursorY = this.cursorY + dy;

      if(this.doDrag){
        if(newCursorY < this.topY){
          this.thumbNode.style.top = 0 + 'px';
          this.cursor = 0;
          this.updateScreenOnScroll(this.cursor);
        }
        else if(newCursorY + this.THUMB_HEIGHT > this.bottomY){
          this.thumbNode.style.top = (this.bottomY - this.topY - this.THUMB_HEIGHT) + 'px';
          this.cursor = 1;
          this.updateScreenOnScroll(this.cursor);
        }
        else {
          this.thumbNode.style.top = (newCursorY - this.topY) + 'px';
          this.cursor = (newCursorY-this.topY) / (this.bottomY - this.topY - this.THUMB_HEIGHT + 1);
          this.updateScreenOnScroll(this.cursor);
        }
      }
    },
    updateScreenOnScroll(currentCursor){
      let screen = tabManager.tabs[app.tabs.activeTabName].screen;
      let totalLines = screen.file.lineBeginnings.length;
      let newOffset = parseInt(totalLines*currentCursor);
      app.buffer.updateToRandomPosition(newOffset);
    }
  },
  template: `
<div class="scrollbar"
    @mousedown="onMouseDown">
    <div class="thumb"
      ></div>
</div>
`
};

module.exports = {
  'scrollbar': scrollbar
}
