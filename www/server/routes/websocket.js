const http = require('http');
const crypto = require("crypto");

const REQUEST_TYPE_LONG_POLLING = 1;
const REQUEST_TYPE_SSE          = 2;
const REQUEST_TYPE_WEBSOCKET    = 3;

const KEEP_ALIVE = 30000;

const webSocketPingBuffer = Buffer.from([
    0b10001001, 0b00000000
]);

const webSocketCloseBuffer = Buffer.from([
    0b10001000, 0b00000000
]);

class WebSocket {
    constructor(title, author) {
        this.clients = [];
    }

    webSocketWrite(data) {
        /* eslint-disable capitalized-comments */

        // Copy the data into a buffer
        data = Buffer.from(data);
        const byteLength = data.length;

        // Note: we're not supporting > 65535 byte payloads at this stage
        const lengthByteCount = byteLength < 126 ? 0 : 2;
        const payloadLength = lengthByteCount === 0 ? byteLength : 126;
        const buffer = Buffer.alloc(2 + lengthByteCount + byteLength);

        // Write out the first byte, using opcode `1` to indicate that the message
        // payload contains text data
        buffer.writeUInt8(0b10000001, 0);
        buffer.writeUInt8(payloadLength, 1);

        // Write the length of the payload to the second byte

        if (lengthByteCount === 2) {
            buffer.writeUInt16BE(byteLength, 2);
        }

        // Write the data to the data buffer
        data.copy(buffer, 2 + lengthByteCount);
        this.socket.write(buffer);
    }

    webSocketGetMessage(buffer) {
        /* eslint-disable no-bitwise, capitalized-comments */

        let dataAfter = "";
        let finalOffset = -1;

        if (buffer.length < 2) {
            return ["", 0];
        }

        const firstByte = buffer.readUInt8(0);

        const isFinalFrame = Boolean((firstByte >>> 7) & 0x1);
        // const [reserved1, reserved2, reserved3] = [
        //     Boolean((firstByte >>> 6) & 0x1),
        //     Boolean((firstByte >>> 5) & 0x1),
        //     Boolean((firstByte >>> 4) & 0x1)
        // ];

        const opCode = firstByte & 0xF;

        // We can return null to signify that this is a connection termination frame
        if (opCode === 0x8) {
            return null;
        }

        const secondByte = buffer.readUInt8(1);
        const isMasked = (secondByte >>> 7) & 0x1;

        // Keep track of our current position as we advance through the buffer
        let currentOffset = 2;
        let payloadLength = secondByte & 0x7F;
        if (payloadLength > 125) {
            if (payloadLength === 126) {
                payloadLength = buffer.readUInt16BE(currentOffset);
                currentOffset += 2;
            } else {
                // 127
                // If this has a value, the frame size is ridiculously huge!
                // const leftPart = buffer.readUInt32BE(currentOffset);
                // const rightPart = buffer.readUInt32BE(currentOffset += 4);
                // Honestly, if the frame length requires 64 bits, you're probably doing it wrong.
                // In Node.js you'll require the BigInt type, or a special library to handle this.
                throw new Error("Large websocket payloads not currently implemented");
            }
        }

        if ((payloadLength + currentOffset) > buffer.length) {
            return ["", 0];
        }

        if (!isFinalFrame) {
            const message = this.webSocketGetMessage(buffer.slice(payloadLength + currentOffset));
            if (message) {
                if (message[1]) {
                    dataAfter = message[0];
                    finalOffset = message[1];
                } else {
                    return ["", 0];
                }
            } else if (message === null) {
                // ??!?
                return null;
            }
        }

        let maskingKey;
        if (isMasked) {
            maskingKey = buffer.readUInt32BE(currentOffset);
            currentOffset += 4;
        }

        // Allocate somewhere to store the final message data
        const data = Buffer.alloc(payloadLength);

        // Only unmask the data if the masking bit was set to 1
        if (isMasked) {
            // Loop through the source buffer one byte at a time, keeping track of which
            // byte in the masking key to use in the next XOR calculation
            for (let i = 0, j = 0; i < payloadLength; ++i, j = i % 4) {
                // Extract the correct byte mask from the masking key
                const shift = (j === 3) ? 0 : (3 - j) << 3;
                const mask = (shift === 0 ? maskingKey : (maskingKey >>> shift)) & 0xFF;

                // Read a byte from the source buffer
                const source = buffer.readUInt8(currentOffset++);

                // XOR the source byte and write the result to the data buffer
                data.writeUInt8(mask ^ source, i);
            }
        } else {
            // Not masked - we can just read the data as-is
            buffer.copy(data, 0, currentOffset);
        }

        return [
            opCode === 0x1
                ? (data.toString("utf8") + dataAfter)
                : "",
            finalOffset === -1
                ? currentOffset
                : finalOffset
        ];
    }

    start(host, port, handleCommands) {

        this.server = http.createServer();
        this.server.setTimeout(0); // The default in node 13 is 0. Earlier versions have 120.

        // See https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
        this.server.on("upgrade", (request, socket) => {
            this.socket = socket;

            const clientId = Date.now();

            socket.on("error", function (e) {
                console.error("Socket error", e.toString());
            });

            socket.on("close", () => {
                console.log('[WS] Closed');
                this.clients = this.clients.filter(c => c.id !== clientId);
            });

            if (request.headers.upgrade.toLowerCase() !== "websocket") {
                socket.end("HTTP/1.1 400 Bad Request\r\n");
                console.error("[WS] FAILED - HTTP header 'Upgrade' is not 'websocket' ");
                return;
            }

            const webSocketKey = request.headers["sec-websocket-key"];

            if (webSocketKey) {
                socket.write(
                    "HTTP/1.1 101 Web Socket Protocol Handshake\r\n" +
                    "Upgrade: WebSocket\r\n" +
                    "Connection: Upgrade\r\n" +
                    "Sec-WebSocket-Accept: " + (
                        crypto
                            .createHash("sha1")
                            .update(webSocketKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", "binary")
                            .digest("base64")
                    ) + "\r\n\r\n"
                );
                console.log("[WS] established");

                const newClient = {
                    id: clientId,
                    socket: socket
                };

                this.clients.push(newClient);

            } else {
                socket.end("HTTP/1.1 400 Bad Request");
                console.error("WS: FAILED - Missing HTTP header 'sec-websocket-key' ");
                return;
            }       

            let receivedBytes = null;

            socket.on("data", (buffer) => {

                // console.log(buffer.toString());

                if (receivedBytes) {
                    buffer = Buffer.concat([receivedBytes, buffer]);
                    receivedBytes = null;
                }

                while (true) {
                    const wsMessage = this.webSocketGetMessage(buffer);
                    if (wsMessage && wsMessage[1]) {
                        if (wsMessage[0]) {
                            handleCommands(wsMessage[0]);
                        }
                    } else if (wsMessage === null) {
                        if (this.socket && !socket.isDestroyed) {
                            this.socket = null;
                            socket.end(webSocketCloseBuffer);
                        }
                        return;
                    }

                    if (wsMessage[1] === buffer.length) {
                        break;
                    }

                    if (wsMessage[1] === 0) {
                        receivedBytes = buffer;
                        return;
                    }

                    buffer = buffer.slice(wsMessage[1]);
                }
            });
        });

        this.server.on("error", function (error) {
            console.error("An error happened in the HTTP server", error);
        });

        this.server.listen(port, host, function () {
            console.log("[WS] Server listening on: http://%s:%s", host, port);
        });
    }
}

module.exports = WebSocket;

