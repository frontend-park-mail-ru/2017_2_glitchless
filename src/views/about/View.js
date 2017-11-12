import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';

class AboutModalView extends View {
    get template() {
        return template;
    }
}

AboutModalView = TemplatedViewMixin(RouterLinksViewMixin(AboutModalView));

export default AboutModalView;
