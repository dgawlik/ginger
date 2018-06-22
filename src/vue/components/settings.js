
let settings =  {
  data: function () {
    return {
      scrollResolution: 1,
      lineWraps: true
    }
  },
  methods: {
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
  <div id="settingsScroll" class="dark-input input-group input-group-sm mb-3">
    <div class="input-group-prepend">
      <span class="input-group-text" id="inputGroup-sizing-sm">Scroll by</span>
    </div>
    <input type="text" v-model="scrollResolution" class="form-control"
      aria-label="Small" aria-describedby="inputGroup-sizing-sm">
  </div>
  <div class="input-group mb-3">
    <div class="input-group-prepend">
      <div class="input-group-text">
        <input v-model="lineWraps" type="checkbox" aria-label="Checkbox for following text input">
        Line wraps
      </div>
    </div>
  </div>
</div>
`
};

module.exports = {
  'settings': settings
}
