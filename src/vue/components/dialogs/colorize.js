const {eventBus} = require('./../../eventBus.js');
const {hashCode} = require('./../../../util.js');

let colorize =  {
  data () {
    return {
      selectedColor : 'red',
      filters: [],
      pattern: ''
    };
  },

  mounted () {
    this.$refs['red'].classList.add('palette-active');
  },

  methods: {
    onColorChoice (colorName) {
      this.$refs[this.selectedColor].classList.remove('palette-active');
      this.$refs[colorName].classList.add('palette-active');
      this.selectedColor = colorName;
    },

    addFilter () {
      this.filters.push({
        'hash': hashCode,
        'pattern': this.pattern,
        'color': this.selectedColor
      });
    },

    removeFilter (hash) {
      let ind = this.filters.findIndex(e => e.hash === hash);
      this.$delete(this.filters, ind);
    }
  },

  computed: {

  },

  template: `
<div id="dialog" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="opacity:1.0">
      <div class="modal-header">
        <h5 class="modal-title">Colorize</h5>
      </div>
      <div class="modal-body">
        <div v-for="filter in filters">
          <span style="font-size: 0.8rem" class="colorize-entry">
            {{filter.pattern}} ({{filter.color}})
          </span>
          <i @click="removeFilter(filter.hash)" class="fas fa-times"></i>
        </div>
        <label>Regex</label>
        <input
         class="form-control-plaintext colorize-input-regex"
         v-model="pattern"
         type="text"
         placeholder="pattern"
        >
        <label>Palette</label>
        <div class="colorize-palette-wrapper">
          <div ref="red" @click="onColorChoice('red')"
            class="colorize-palette-item palette-red"></div>
          <div ref="blue" @click="onColorChoice('blue')"
            class="colorize-palette-item palette-blue"></div>
          <div ref="green" @click="onColorChoice('green')"
            class="colorize-palette-item palette-green"></div>
          <div ref="orange" @click="onColorChoice('orange')"
            class="colorize-palette-item palette-orange"></div>
          <div ref="red-light" @click="onColorChoice('red-light')"
            class="colorize-palette-item palette-red-light"></div>
          <div ref="blue-light"  @click="onColorChoice('blue-light')"
            class="colorize-palette-item palette-blue-light"></div>
          <div ref="green-light" @click="onColorChoice('green-light')"
            class="colorize-palette-item palette-green-light"></div>
          <div ref="orange-light" @click="onColorChoice('orange-light')"
            class="colorize-palette-item palette-orange-light"></div>
        </div>
        <button @click="addFilter">Add</button>
      </div>
    </div>
  </div>
</div>
`
};

module.exports = {
  colorize
};
