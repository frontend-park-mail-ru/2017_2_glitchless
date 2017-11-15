import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';

class LobbyView extends View {
    open(root) {
        this.progressText = document.getElementsByClassName('lobby__progresstext');
        this.serviceLocator.magicTransport.openSocket();
        this.serviceLocator.magicTransport.send({type: "WantPlayMessage", state: 1})
    }

    get template() {
        return template;
    }
}

export default TemplatedViewMixin(RouterLinksViewMixin(LobbyView));
