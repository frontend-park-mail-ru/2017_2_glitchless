import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import template from './template.pug';
import './style.scss'

class AboutModalView extends View {
    get template() {
        return template;
    }
}

AboutModalView = TemplatedViewMixin(RouterLinksViewMixin(AboutModalView));

export default AboutModalView;
