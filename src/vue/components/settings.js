
let settings =  {
  data: function () {
    return {
      scrollResolution: 1,
      lineWraps: true
    }
  },

  watch : {
    scrollResolution: function(val){
      settingsManager.scrollResolution = parseInt(val);
    },

    lineWraps: function(val){
      settingsManager.setLineWraps(val);
    }
  },

  template: `
<div id="settingsContainer">
  <h2>General</h2>
  <form>
    <div class="form-group row">
      <label for="settingsScroll" class="col-sm-2 col-form-label">Scroll resolution</label>
      <div class="col-sm-10">
        <input type="text" v-model="scrollResolution" class="form-control-plaintext" id="settingsScroll">
      </div>
    </div>
    <div class="form-group row">
      <label for="lineWraps" class="col-sm-2 col-form-label">Wrap lines</label>
      <div class="col-sm-10">
        <label class="custom-checkbox">
            <input v-model="lineWraps" type="checkbox" id="lineWraps">
            <span class="fas"></span>
        </label>
      </div>
    </div>
  </form>
</div>
`
};

module.exports = {
  'settings': settings
}
