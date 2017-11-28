import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../_view_mixins/ModalShadeViewMixin';
import template from './template.pug';

class LobbyView extends View {

    open(root, data = null) {
        this.progressText = document.getElementsByClassName('lobby__progresstext').item(0);
        this.serviceLocator.magicTransport.openSocket();
        this.serviceLocator.magicTransport.send({type: 'WantPlayMessage', state: 1});
        this.serviceLocator.magicTransport.eventBus.subscribeOn('ws_close', this.onClose, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('GameInitState', this.onNewSocketMessage, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('FullSwapScene', this._onOpenGame, this);
    }

    get template() {
        return template;
    }

    onNewSocketMessage(data) {
        switch (data.state) {
            case 2: {
                this._showText('Waiting player...');
                break;
            }
            case 3: {
                this._showText('Waiting room...');
                break;
            }
            case 10: {
                this._showText('Ready! Open game...');
                break;
            }
        }
    }

    _onOpenGame(data) {
        this.serviceLocator.router.changePage('/play', data);
    }

    onClose(event) {
        this._showText(event.reason);
    }

    _showText(text) {
        this.progressText.innerText = text;
    }
}

export default TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LobbyView)));
