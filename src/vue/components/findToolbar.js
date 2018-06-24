
let findToolbar =  {
  props: ['isValid', 'isShow'],

  methods: {
    onClose(){
      window.findToolbar.isShow = false;
    }
  },

  template: `
<div v-if="isValid && isShow" id="findToolbar">
  <input type="text" id="findToolbarInput">
  <i class="fas fa-angle-left"></i>
  <i class="fas fa-angle-right"></i>
  <button id="findToolbarSearch">
    <i class="fas fa-search"></i>
    Search
  </button>
  <i @click="onClose" class="fas fa-times"></i>
</div>
`
};

module.exports = {
  'findToolbar': findToolbar
}
