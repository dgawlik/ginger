const {eventBus} = require('./../../eventBus.js');

let gotoLine =  {
  data () {
    return {
      line: 0,
      isValid: true
    };
  },

  mounted () {
  },

  methods: {
    gotoLine () {
      if (this.isValid) {
        eventBus.$emit('gotoline/go', this.line);
        eventBus.$emit('dialog/close');
      }
    },

    validate () {
      this.isValid = !isNaN(this.line);
    },

    close () {
      eventBus.$emit('dialog/close');
    }
  },

  computed: {
    inputClassObject () {
      return {
        'form-control-plaintext': true,
        'gotoline-input': true,
        'input-error': !this.isValid
      };
    },

    buttonClassObject () {
      return {
        'gotoline-button': true,
        'button-error': !this.isValid
      };
    }
  },

  template: `
<div id="dialog" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="opacity:1.0">
      <div class="modal-header">
        <h5 class="modal-title">Go to line</h5>
        <i @click="close" class="fas fa-times modal-close"></i>
      </div>
      <div class="modal-body">
        <input
         v-model="line"
         v-bind:class="inputClassObject"
         type="text"
         placeholder="line"
         @input="validate"
        >
      </div>
      <button
       @click="gotoLine"
       v-bind:class="buttonClassObject"
      >Go</button>
    </div>
  </div>
</div>
`
};

module.exports = {
  gotoLine
};
