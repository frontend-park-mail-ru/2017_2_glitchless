import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import './style.scss';

class LobbyView extends View {
    open(root, data = null) {
        this.progressTextElem = root.getElementsByClassName('lobby__progresstext').item(0);
        this.waitingLabelElem = root.getElementsByClassName('lobby__waitinglabel').item(0);
        this.returnButtonElem = root.getElementsByClassName('modal-control').item(0);
        this.isGameAborted = false;

        this.serviceLocator.magicTransport.openSocket();
        this.serviceLocator.magicTransport.send({type: 'WantPlayMessage', state: 1});
        this.serviceLocator.magicTransport.eventBus.subscribeOn('ws_close', this.onClose, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('ws_error', this.onError, this);
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
        let message = 'Game closed';
        if (event.reason) {
            message += ': ' + event.reason;
        }
        this._abortGameAndShowText(message);
    }

    onError(event) {
        let message = 'Cannot connect to game server';
        if (event.reason) {
            message += ': ' + event.reason;
        }
        this._abortGameAndShowText(message);
    }

    _showText(text) {
        this.progressTextElem.textContent = text;
    }

    _abortGameAndShowText(text) {
        if (this.isGameAborted) {
            return;
        }
        this.isGameAborted = true;

        this.waitingLabelElem.classList.add('hidden');
        this.returnButtonElem.classList.remove('hidden');
        this.progressTextElem.textContent = text;
    }
}

export default TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LobbyView)));
