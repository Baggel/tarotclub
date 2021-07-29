const router = require('express').Router();
const jwt = require('jsonwebtoken');
const JwtUtil = require("../jwtutil.js");
// const WebSocket = require('ws');

let list = new Map();
let sskList = new Map();

let tarotServers = [];


/*
router.get('/events', JwtUtil.checkTokenForServers, (req, res, next) => {

    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        "Access-Control-Allow-Origin": '*'
      });

      //=> Flush headers immediately
    // This has the advantage to 'test' the connection: if the client can't access this resource because of
    // CORS restrictions, the connection will fail instantly.
      res.flushHeaders();

    // After client opens connection send all nests as string

    

    // let interValID = setInterval(() => {
    //     counter++;
    //     // if (counter >= 10) {
    //     //     clearInterval(interValID);
    //     //     res.end(); // terminates SSE session
    //     //     return;
    //     // }
    //     res.write(`data: ${JSON.stringify({num: counter})}\n\n`); // res.write() instead of res.send()
    // }, 1000);
    
    const tarotServerId = Date.now();
    const timerId = setInterval(() => {
                // Emit an SSE that contains the current 'count' as a string
                sendEventsToOneServer("Allow player", { payer: "plop" }, tarotServerId);
            }, 1000);

    const newClient = {
      id: tarotServerId,
      res,
      timerId: timerId
    };
    console.log("[SSE] New connection: " + tarotServerId);

    tarotServers.push(newClient);

    // When client closes connection we update the tarotServers list
    // avoiding the disconnected one
    res.on('close', () => {
       console.log("[SSE] Connection closed: " + tarotServerId);
       clearInterval(timerId);
       tarotServers = tarotServers.filter(c => c.id !== tarotServerId);
      
    });
});
*/
function sendEventsToOneServer(message, data, tarotServerId) {
    tarotServers.forEach((c) => {
        if (c.id == tarotServerId) {
            c.res.write(JSON.stringify({
                success: true,
                data: data,
                message: message
            }));
        }
    });
}

// Iterate tarotServers list and use write res object method to send new nest
function sendEventsToAll(message) {
    tarotServers.forEach(c => c.res.write(JSON.stringify({
            success: true,
            data: { },
            message: message
        }))
    );
}

router.get('/list', (req, res) => {

    res.status(200).json({
            success: true,
            data: Array.from(list).map( ([k,v]) => {return v} ),
            message: 'Servers list'
    });
});

router.post('/register', (req, res, next) => {

    let allowedServer = false;
    let token = req.body.token;
    let server = req.body.server;
  //  sendEventsToAll("coucou");

    if (token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {

        // Create JWT
        const serverObj = {
            token: token,
            name: server.name
        };

        // server object contains only public information, keep token and ssk private!
        list.set(token, server);
        

        let ssk = jwt.sign ({server: serverObj}, process.env.JWT_SERVER_SECRET);
        console.log("[SERVERS] Added new server");
        
        sskList.set(token, ssk);

        res.status(200).json({
            success: true,
            data: {
                ssk: ssk,
            },
            message: 'Server registered'
        });

    } else {
        res.status(200).json({
            success: false,
            data: {},
            message: 'Cannot register server'
        });
    }
});

router.post('/status', JwtUtil.checkTokenForServers, (req, res, next) => {
    // Update status
    let token = req.body.token;
    let server = req.body.server;
    server.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let allowedServer = false;

    console.log("[TCDS] Received status from server");

  //  sendEventsToAll("coucou");

    if (req.body.token == process.env.TCDS_OFFICIAL_TOKEN1) {
        allowedServer = true;
    } else {
        // Serveur non officiel
        // TODO: il doit avoir été créé avant par un utilisateur valide
        allowedServer = true;
    }

    if (allowedServer) {
        list.set(token, server);
        res.status(200).json({
            success: true,
            data: {},
            message: 'Status updated'
        });

        // On envoie à tous les clients connectés la liste des serveurs
        // sendToAllClients(getServerList());

    } else {
        res.status(200).json({
            success: false,
            data: {},
            message: 'Status update forbidden'
        });
    }
});


module.exports = router;
