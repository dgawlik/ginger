
class $1{
  progress(val){
    progressBar.updateProgress(val);
  }
}

let findToolbar =  {
  props: ['isValid', 'isShow'],

  data: function(){
    return {
      findText: ''
    };
  },

  methods: {
    onClose(){
      window.findToolbar.isShow = false;
    },

    onSearch(){
      let triggeringTab = app.tabs.getActiveTab();
      progressBar.show();
      triggeringTab.screen.file
        .find(this.findText, new $1())
        .then(matches => {
          console.log(matches);
          progressBar.hide();
        });
    }
  },

  template: `
<div v-if="isValid && isShow" id="findToolbar">
  <input type="text" id="findToolbarInput" v-model="findText">
  <i class="fas fa-angle-left"></i>
  <i class="fas fa-angle-right"></i>
  <button id="findToolbarSearch" @click="onSearch">
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
