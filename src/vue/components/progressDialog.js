
let progressDialog =  {
  data () {
    return {
      progress: 0
    };
  },

  methods: {
    update (val) {
      this.progress = val;
    }
  },

  computed: {
    styleWidth () {
      return {
        width: this.progress+'%'
      };
    }
  },

  template: `
<div id="dialog" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content" style="opacity:1.0">
      <div class="modal-header">
        <h5 class="modal-title">Loading</h5>
      </div>
      <div class="modal-body">
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            :style="styleWidth"></div>
        </div>
      </div>
    </div>
  </div>
</div>
`
};

module.exports = {
  progressDialog
};
