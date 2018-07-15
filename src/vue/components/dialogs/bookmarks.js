const {eventBus} = require('./../../eventBus.js');
const {hashCode} = require('./../../../util.js');

let bookmarks =  {
  data () {
    return {
      isLineValid: false,
      isDescriptionValid: false,
      line: '',
      description: '',
      entries: []
    };
  },

  mounted () {
    eventBus.$on('bookmarks/populate', entries => {
      this.entries = entries;
      this.$forceUpdate();
    });
  },

  methods: {
    gotoLine (line) {
      eventBus.$emit('gotoline/go', line);
      eventBus.$emit('dialog/close');
    },

    validate () {
      this.isLineValid = !isNaN(this.line);
      this.isDescriptionValid = this.description !== '';
    },

    addEntry () {
      this.entries.push({
        hash: hashCode(this.line, this.description),
        line: +this.line,
        description: this.description
      });

      eventBus.$emit('bookmarks/tab/update', this.entries);
    },

    removeEntry (hash) {
      let ind = this.entries.findIndex(e => e.hash === hash);
      this.$delete(this.entries, ind);
    },

    close () {
      eventBus.$emit('dialog/close');
    }
  },

  computed: {
    buttonClassObject () {
      return {
        'bookmarks-button': true,
        'button-error': !this.isLineValid || !this.isDescriptionValid
      }
    },

    lineInputClassObject () {
      return {
        'form-control-plaintext': true,
        'input-error': !this.isLineValid
      };
    },

    descriptionInputClassObject () {
      return {
        'form-control-plaintext': true,
        'input-error': !this.isDescriptionValid
      };
    }
  },

  template: `
<div id="dialog" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="opacity:1.0">
      <div class="modal-header">
        <h5 class="modal-title">Bookmarks</h5>
        <i @click="close" class="fas fa-times modal-close"></i>
      </div>
      <div class="modal-body">
        <div class="bookmarks-entries">
          <div v-for="entry in entries" class="bookmarks-entry">
            <div class="bookmarks-description">
              {{entry.description}}
            </div>
            <div class="bookmarks-menu">
              <i @click="gotoLine(entry.line)" class="fas fa-arrow-right"></i>
              <i @click="removeEntry(entry.hash)" class="fas fa-times"></i>
            </div>
          </div>
        </div>
        <label>Line number</label>
        <input
         v-bind:class="lineInputClassObject"
         type="text"
         placeholder="line"
         v-model="line"
         @input="validate"
        >
        <label>Description</label>
        <input
         v-bind:class="descriptionInputClassObject"
         type="text"
         placeholder="description"
         v-model="description"
         @input="validate"
        >
        <button @click="addEntry" v-bind:class="buttonClassObject">Add</button>
      </div>
    </div>
  </div>
</div>
`
};

module.exports = {
  bookmarks
};
