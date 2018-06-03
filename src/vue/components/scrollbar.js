
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
    },
    onMouseMove(e){
      let topY = this.scrollbarNode.getBoundingClientRect().top;
      let bottomY = this.scrollbarNode.getBoundingClientRect().bottom;
      let cursorY = this.thumbNode.getBoundingClientRect().top;

      if(this.doDrag && e.pageY >= topY && e.pageY + this.THUMB_HEIGHT < bottomY){
        this.thumbNode.style.top = (e.pageY - topY) + 'px';
        this.cursor = parseFloat(e.pageY - this.THUMB_HEIGHT) / (bottomY - topY - this.THUMB_HEIGHT);
        app.updateScreenOnScroll(this.cursor);
      }
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
