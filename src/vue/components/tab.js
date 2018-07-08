const {eventBus} = require('../eventBus.js');

let tab =  {
  props: ['name', 'isActive'],

  data () {
    return {
      mouseOver: false
    };
  },

  methods: {
    onMouseEnter () {
      this.mouseOver = true;
    },

    onMouseLeave () {
      this.mouseOver = false;
    },

    onActivateClick () {
      eventBus.$emit('tabs/activateTab', this.name);
    },

    onCloseClick () {
      eventBus.$emit('tabs/closeTab', this.name);
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
  tab
};
