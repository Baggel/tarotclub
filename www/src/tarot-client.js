
import ReconnectingWebSocket from 'reconnecting-websocket';

const genders = ['Male', 'Female', 'Robot', 'Human', 'Other'];

const INVALID_UID       = 0;
const LOBBY_UID         = 1;

export default class TarotClient {

    constructor() {
        this.player = {
            uuid: INVALID_UID,
            nickname: 'PlayerUnknown',
            avatar: '',
            gender: 'Human'
          };   
    }

    connectToServer() {
        this.ws = new ReconnectingWebSocket(this.getWebSocketHost());

        this.ws.onopen = this.handleWebSocketOpen;
        this.ws.onerror = this.handleWebSocketError;
        this.ws.onmessage = this.handleWebSocketMessage;
    }

    handleWebSocketMessage = (message) => {
        console.log("[WS] Received: " + message.data);

        let msg = this.parsePacket(message.data);

        if (msg.isValid) {
            if (msg.data.cmd == 'RequestLogin')  {
                this.player.uuid = msg.data.uuid;
                this.replyLogin();
            }
        } else {
            console.log('[WS] Invalid packet!');
        }       
    }

    handleWebSocketError(event) {

    }

    handleWebSocketOpen(event) {
        
    }

    getWebSocketHost()
    {
        let wsHost = (((window.location.protocol === "https:") ? "wss://" : "ws://") + window.location.hostname + ":4270");
        console.log("Web socket host: " + wsHost);
        return wsHost;
    }

    replyLogin()
    {
        let json = {
            cmd: 'ReplyLogin',
            nickname: this.player.nickname,
            avatar: this.player.avatar,
            gender: this.player.gender,
        };

        this.send(LOBBY_UID, json);
    }

    paddedInt(value) {
        return value.toString(16).padStart(4, '0');
    }

    parsePacket(packet) {
        let message = {
            options: 0,
            uuid_dst: 0,
            uuid_src: 0,
            data: {},
            isValid: false
        };
        // Exemple:
        //
        // 00:0001:000a:002f:DATA: { .. }
        // <----  header     --->   Json data

        // header size = 23
        // Json size = minimum 2 {} or []
        // Minimum packet size ==> 25
        if (packet.length >= 25) {
            const header = packet.substring(0, 22);
            const words = header.split(':');
            const jsonData = packet.slice(23);
            if (words.length >= 5) {
                try {
                    message.data = JSON.parse(jsonData);
                    message.options = parseInt(words[0], 16);
                    message.uuid_src = parseInt(words[1], 16);
                    message.uuid_dst = parseInt(words[2], 16);
                    if (words[4] == 'DATA') {
                        message.isValid = true;  
                    }  
                } catch (error) {
                    console.error(error);
                }
            }
        }
        
        return message;
    }

    // dest is an integer (UUID)
    // Data is a JSON structure
    send(dest, data) {
        try {
            const dataStr = JSON.stringify(data);
            let replyPacket = '00:' + this.paddedInt(this.player.uuid) + ':' + this.paddedInt(dest) + ':' + this.paddedInt(dataStr.length) + ':DATA:' + dataStr;
            this.ws.send(replyPacket);    
        } catch (error) {
            console.log('[TarotClient] ' + error);
        }
    }

    getRootUrl()
    {
        let uri = window.location.protocol + "//" + window.location.host;
        return uri;
    }
}
