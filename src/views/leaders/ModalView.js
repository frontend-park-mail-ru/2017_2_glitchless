const View = require('../View.js');
const templatedViewMixin = require('../TemplatedViewMixin.js');
const template = require('./template.pug');


class LeadersModalView extends View {
    get template() {
        return template;
    }
}

module.exports = templatedViewMixin(LeadersModalView);