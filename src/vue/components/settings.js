
let settings =  {
  data: function () {
    return {
      scrollResolution: 1
    }
  },
  methods: {
  },
  watch : {
    scrollResolution: function(val){
      settingsManager.scrollResolution = parseInt(val);
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
</div>
`
};

module.exports = {
  'settings': settings
}
