const STATE_CONNECTING = 0; // Соединение ещё не открыто.
const STATE_OPEN = 1; // Соединение открыто и готово к обмену данными.
const STATE_CLOSING = 2; // Соединение в процессе закрытия.
const STATE_CLOSED = 3; // Соединение закрыто или не может открыться.

export default class MagicTransport {
    private websocketUrl: string;
    private socket: WebSocket;
    private objectQueue: object[];

    constructor(websocketUrl: string) {
        this.websocketUrl = websocketUrl;
        this.objectQueue = [];
    }

    public openSocket() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);
    }

    private onOpen() {
        console.log('Websocket: onOpen');
        while (this.objectQueue.length > 0) {
            this.send(this.objectQueue.pop());
        }
    }

    private onMessage(data) {
        console.log('Websocket: onMessage ');
        console.log(data);
    }

    private onError(error) {
        console.log('Websocket: onError ');
        console.log(error);
    }

    private onClose(event) {
        console.log('Websocket: onClose');
        console.log(event);
    }

    private send(object) {
        if (this.socket.readyState !== STATE_OPEN) {
            console.log('Object push to queue');
            console.log(object);
            this.objectQueue.push(object);
            return;
        }
        console.log('Sending:...');
        console.log(object);
        this.socket.send(JSON.stringify(object));
    }
}
