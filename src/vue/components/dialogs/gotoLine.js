const {eventBus} = require('./../../eventBus.js');

let gotoLine =  {
  data () {
    return {
      line: 0
    };
  },

  mounted () {
  },

  methods: {
    gotoLine () {
      eventBus.$emit('gotoline/go', this.line);
      eventBus.$emit('dialog/close');
    }
  },

  template: `
<div id="dialog" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="opacity:1.0">
      <div class="modal-header">
        <h5 class="modal-title">Go to line</h5>
      </div>
      <div class="modal-body">
        <input v-model="line" class="form-control-plaintext gotoline-input" type="text" placeholder="line">
      </div>
      <button @click="gotoLine" class="gotoline-button">Go</button>
    </div>
  </div>
</div>
`
};

module.exports = {
  gotoLine
};
