import EventBus from '../../services/EventBus.js';

const STATE_CONNECTING = 0; // Соединение ещё не открыто.
const STATE_OPEN = 1; // Соединение открыто и готово к обмену данными.
const STATE_CLOSING = 2; // Соединение в процессе закрытия.
const STATE_CLOSED = 3; // Соединение закрыто или не может открыться.

export default class MagicTransport {
    public eventBus: EventBus;
    private websocketUrl: string;
    private socket: WebSocket;
    private objectQueue: object[];
    private doDebugLog: boolean;

    constructor(websocketUrl: string, {debug = false} = {}) {
        this.websocketUrl = websocketUrl;
        this.objectQueue = [];
        this.eventBus = new EventBus();
        this.doDebugLog = debug;
    }

    public openSocket() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    public send(object) {
        if (this.socket.readyState !== STATE_OPEN) {
            if (this.doDebugLog) {
                console.log('Object push to queue');
                console.log(object);
            }
            this.objectQueue.push(object);
            return;
        }
        if (this.doDebugLog) {
            console.log('Sending:...');
            console.log(object);
        }
        this.socket.send(JSON.stringify(object));
    }

    private onOpen() {
        if (this.doDebugLog) {
            console.log('Websocket: onOpen');
        }
        while (this.objectQueue.length > 0) {
            this.send(this.objectQueue.pop());
        }

        this.eventBus.emitEvent('ws_open');
    }

    private onMessage(message) {
        if (this.doDebugLog) {
            console.log('Websocket: onMessage ');
        }
        const jsObject = JSON.parse(message.data);
        if (this.doDebugLog) {
            console.log(jsObject);
        }
        this.eventBus.emitEvent(jsObject.type, jsObject);
    }

    private onError(error) {
        if (this.doDebugLog) {
            console.log('Websocket: onError ');
            console.log(error);
        }
        this.eventBus.emitEvent('ws_error', error);
    }

    private onClose(event) {
        if (this.doDebugLog) {
            console.log('Websocket: onClose');
            console.log(event);
        }
        this.eventBus.emitEvent('ws_close', event);
    }
}
