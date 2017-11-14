export default class MagicTransport {
    private websocketUrl: string;
    private socket: WebSocket;

    constructor(websocketUrl: string) {
        this.websocketUrl = websocketUrl;
    }

    public openSocket() {
        this.socket = new WebSocket(this.websocketUrl);
        this.socket.onopen = this.onOpen;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;
    }

    private onOpen() {
        console.log('Websocket: onOpen');
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
}
