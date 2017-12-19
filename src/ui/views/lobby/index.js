import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import './style.scss';

class LobbyView extends View {
    open(root, data) {
        if (data !== null) {
            console.log('Your invite code: ' + data);
            if (data === 'ref') {
                data = 'ref';
            } else {
                data = 'ref:' + data;
            }
        }
        this.progressTextElem = root.getElementsByClassName('lobby__progresstext').item(0);
        this.waitingLabelElem = root.getElementsByClassName('lobby__waitinglabel').item(0);
        this.returnButtonElem = root.getElementsByClassName('modal-control').item(0);
        this.loaderSpinner = root.getElementsByClassName('lobby__loader').item(0);
        this.linkElem = root.getElementsByClassName('lobby__linktext').item(0);
        this.isGameAborted = false;

        this.serviceLocator.magicTransport.openSocket();
        this.serviceLocator.magicTransport.send({type: 'WantPlayMessage', state: 1, data});
        this.serviceLocator.magicTransport.eventBus.subscribeOn('ws_close', this.onClose, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('ws_error', this.onError, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('GameInitState', this.onNewSocketMessage, this);
        this.serviceLocator.magicTransport.eventBus.subscribeOn('FullSwapScene', this._onOpenGame, this);
        this.linkElem.addEventListener('click', () => this._copyToClipboard(this.linkElem));
    }

    get template() {
        return template;
    }

    onNewSocketMessage(data) {
        switch (data.state) {
            case 2: {
                this._showText('Waiting for player2 to connect...');
                break;
            }
            case 3: {
                this._showText('Please wait while your resources are loading');
                this.serviceLocator.magicTransport.send({type: 'WantPlayMessage', state: 4});
                break;
            }
            case 4: {
                this._showText('Waiting while player2 is loading resources');
                break;
            }
            case 5: {
                this._showText('Click on link for copy in clipboard and share with friend!');
                this.linkElem.innerHTML = window.location.origin + '/lobby/' + data.data.split(':')[1];
                this.linkElem.style.display = 'block';
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
        let message = 'Game session closed';
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

        this.loaderSpinner.classList.add('hidden');
        this.waitingLabelElem.classList.add('hidden');
        this.returnButtonElem.classList.remove('hidden');
        this.progressTextElem.textContent = text;
    }

    _copyToClipboard(elem) {
        // create hidden text element, if it doesn't already exist
        const targetId = '_hiddenCopyText_';
        const isInput = elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
        let origSelectionStart;
        let origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                const target = document.createElement('textarea');
                target.style.position = 'absolute';
                target.style.left = '-9999px';
                target.style.top = '0';
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        const currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        let succeed;
        try {
            succeed = document.execCommand('copy');
        } catch (e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === 'function') {
            currentFocus.focus();
        }

        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = '';
        }
        return succeed;
    }

}

export default TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LobbyView)));
