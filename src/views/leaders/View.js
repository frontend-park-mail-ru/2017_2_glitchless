import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';


class LeadersModalView extends View {
    get template() {
        return template;
    }
}

LeadersModalView = TemplatedViewMixin(RouterLinksViewMixin(LeadersModalView));

export default LeadersModalView;
