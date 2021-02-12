const express = require("express");
const cors = require("cors");
const liveStreamApp = express();

liveStreamApp.use(cors());
const clients = {};

// @TODO: This server should receives msgs from AMQPCloud

liveStreamApp.get('/wallet', async (req, res) => {
    const client = req.query.client;
    clients[client] = res; // save response in memory
    console.info(`Registered: ${client}`)
    // remove client when disconnect
    res.socket.on('end', e => {
        delete clients[client];
        console.info(`Unregistered: ${client}`)
        res.end();
    });
    // accept SSE stream
    res.setHeader("Content-Type", "text/event-stream");
    // send welcome msg
    res.write(`event: walletChange\n`);
    res.write(`data: Hello ${client}, you will receive updates when available...\n\n`);
})


setInterval(_ => {
    // send balance to registered clients every 10s || when needed
    Object.keys(clients).forEach(client => {
        console.log(`Sending msg to ${client}...`);
        clients[client].write(`event: walletChange\n`);
        clients[client].write(`data: Your balance ${client}!\n\n`);
    })
}, 10000)


liveStreamApp.listen(1979, _ => console.info(`listening on 1979...`));