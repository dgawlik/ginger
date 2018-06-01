const {tab} = require('./tab.js');

let tabs =  {
  props: ['tabs'],
  data: function () {
    return {
    }
  },
  template: '<div data-tabs="true" class="tabs"><tab v-for="tabAttr in tabs" :key="tabAttr.name" :name="tabAttr.name" :isActive="tabAttr.isActive"></tab></div>',
  components: {
    'tab': tab,
  },
};

module.exports = {
  'tabs' : tabs
}
