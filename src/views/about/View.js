const View = require('../View.js');
const TemplatedViewMixin = require('../TemplatedViewMixin.js');
const template = require('./template.pug');


class AboutModalView extends View {
    get template() {
        return template;
    }
}

module.exports = TemplatedViewMixin(AboutModalView);