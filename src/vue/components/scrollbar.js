
let scrollbar =  {
  data: function () {
    return {
      cursor: 0
    }
  },
  mounted() {
    this.thumbNode = document.querySelector('.scrollbar .thumb');
    this.scrollbarNode = document.querySelector('.scrollbar');
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

      if(this.doDrag && e.pageY + 30 >= topY && e.pageY + 30 < bottomY){
        this.thumbNode.style.top = (e.pageY - topY) + 'px';
        this.cursor = parseFloat(e.pageY) / (bottomY - topY);
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
