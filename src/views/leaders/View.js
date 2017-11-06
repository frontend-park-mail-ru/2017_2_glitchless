const View = require('../View.js');
const TemplatedViewMixin = require('../_view_mixins/TemplatedViewMixin.js');
const RouterLinksViewMixin = require('../_view_mixins/RouterLinksViewMixin.js');
const template = require('./template.pug');


class LeadersModalView extends View {
    get template() {
        return template;
    }
}

module.exports = TemplatedViewMixin(RouterLinksViewMixin(LeadersModalView));