
let tab =  {
  props: ['name', 'isActive'],

  data: function () {
    return {
      mouseOver: false
    }
  },

  methods: {
    onMouseEnter: function(){
      this.mouseOver = true;
    },

    onMouseLeave: function(){
      this.mouseOver = false;
    },

    onActivateClick: function(){
      app.tabs.activateTab(this.name);
    },

    onCloseClick: function(){
      app.tabs.closeTab(this.name);
    }
  },
  
  template: `
<div @click="onActivateClick" class="tabOuterContainer" @mouseenter="onMouseEnter()" @mouseleave="onMouseLeave()">
  <div class="tabTextHolder">{{name}}</div>
  <div class="tabCloseBtn"><i v-if="isActive || mouseOver" @click="onCloseClick" class="fas fa-times-circle"></i></div>
</div>
`
};

module.exports = {
  'tab': tab
}
