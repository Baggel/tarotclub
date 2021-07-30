
const jwtUtil = require("../jwtutil.js");
const WebSocket = require('../websocket.js');

let list = new Map(); // liste des serveurs: key = token, value = serveur object (ip, stats...)
let wsClients = new Map(); // key = token, value = web socket client object { id, socket }

/*

{ 
    "id":1624611819492,
    "name":"TarotServer",
    "nb_players":0,
    "nb_tables":1,
    "tcp_port":4269,
    "ws_port":4270
}

*/

// ================================================================================================
// LINK WITH TCDS TAROTCLUB SERVER EXECUTABLES
// ================================================================================================
const wss = new WebSocket();

wss.start("127.0.0.1", 8989, (cmd, client) => {

    // récupérer remote adresse lors du protocol upgrade, pour obtenir l'en-tête http x-forwarded-for
    // server.ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        let json = JSON.parse(cmd);

        if (list.has(json.token)) {
            updateServerStatus(json.token, json.server);
        } else {
            if (registerNewServer(json.token, json.server)) {
                // Accepté, on associe le client websocket à ce serveur
                wsClients.set(json.token, client);
                sendToGameServer(list.get(json.token).id, {
                    cmd: 'register',
                    success: true
                });
            }
        }

    } catch (error) {
        console.error(error);
    }
});

wss.onConnect = (newClient) => {
    console.log("Connected client ID: " + newClient.id);
};

wss.onClose = (client) => {
    console.log("Closed client ID: " + client.id);
    wsClients = wsClients.filter(c => c.id !== client.id);
};

function registerNewServer(token, server) {
    let allowedServer = false;
    let success = false;

    if (token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {
        // server object contains only public information, keep token and ssk private!
        server.id = Date.now();
        list.set(token, server);
        // console.log("[SERVERS] Added new server: " + JSON.stringify(server));

        success = true;
    }
    return success;
}

function updateServerStatus(token, server) {
    // Update status
    let allowedServer = false;

    // console.log("[TCDS] Received status from server");
    if (token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {
        list.set(token, server);
    }
}

function sendToGameServer(id, messageObj) {
    let orderSent = false;
    list.forEach((value, key, map) => {
        if (value.id == id) {
            if (wsClients.has(key)) {
                let c = wsClients.get(key);
                if (c != undefined) {
                    wss.webSocketWrite(JSON.stringify(messageObj), c.socket);
                    orderSent = true;
                }
            }
        }
    });
    return orderSent;
}

// ================================================================================================
// PUBLIC ACCESS TO LIST OF SERVERS (client web, Qt, console ...)
// ================================================================================================
let publicListeners = [];


function mapToArray() {
    return Array.from(list).map(([k, v]) => { return v });
}

function getServersList(req, reply)
{
    reply.code(200).send({
        success: true,
        data: mapToArray(),
        message: 'Servers list'
    });
}

function joinServer (req, reply)
{
    console.log("[SERVERS] Join request to: " + JSON.stringify(req.body.server));

    // On génère une clé de jeu partagée entre le client et le serveur
    let gek = jwtUtil.genRandomString(16);
    let passPhrase = jwtUtil.genRandomString(32);
    let webId = Date.now();
    // on génère un id pour ce joueur histoire de tracer sa demande de connexion
    // Il permet au serveur d'asscocié ce joueur et sa clé GEK

    if (sendToGameServer(req.body.server.id,
        {
            cmd: 'join',
            webId: webId,
            gek: gek,
            passPhrase: passPhrase
        })) {
        reply.code(200).send({
            success: true,
            data: {
                gek: gek,
                passPhrase: passPhrase
            },
            message: "Join request success"
        });
    } else {
        reply.code(200).send({
            success: false,
            data: {},
            message: 'Cannot communicate with game server'
        });
    }
}


function getEvents (req, reply)
{
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('Transfer-Encoding', 'identity');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    reply.raw.setHeader("Access-Control-Allow-Origin", '*');

    reply.raw.socket.setKeepAlive(true);
    reply.raw.socket.setNoDelay(true);
    reply.raw.socket.setTimeout(0);

    //=> Flush headers immediately
    // This has the advantage to 'test' the connection: if the client can't access this resource because of
    // CORS restrictions, the connection will fail instantly.
    reply.raw.flushHeaders();

    // After client opens connection send all nests as string  

    const listenerId = Date.now();
    const newListener = {
        id: listenerId,
        res: reply.raw,
    };
    console.log("[SSE] New connection: " + listenerId);

    publicListeners.push(newListener);

    // When client closes connection we update the publicListeners list
    // avoiding the disconnected one
    reply.raw.on('close', () => {
        console.log("[SSE] Connection closed: " + listenerId);
        publicListeners = publicListeners.filter(c => c.id !== listenerId);

    });
}

const periodicPublicTimer = setInterval(function () {
    sendEventsToAll('servers', mapToArray())
}, 500);

// Iterate publicListeners list and use write res object method to send new nest
function sendEventsToAll(event, data) {
    publicListeners.forEach((c) => {
        let message = "event: " + event + "\ndata: " + JSON.stringify(data) + "\n\n";
        // console.log("Send event to: " + c.id + "message: " + message);
        c.res.write(message);
    });
}

module.exports = async function (fastify) {

    fastify.get('/list', getServersList);
    fastify.post('/join', { preHandler: jwtUtil.checkTokenAllUsers }, joinServer);
    fastify.get('/events', getEvents);
}

