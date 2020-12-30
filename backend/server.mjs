
import Test from "../common/Test.mjs"

// const express = require('express')

import express from "express"
const app = express()
import expressWs from "express-ws"
// var expressWs = require('express-ws')(app);
expressWs(app)


const port = 3000

app.get('/api/test', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static('../frontend/src'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  var t = new Test("hello");


  const j = JSON.stringify(t);
  console.log(j)
  console.log(Test.fromJSONString(j));
})

var sockets = [];

app.ws('/api/socket', function(ws, req) {
  console.log("New socket!");
  sockets.push(ws);

  ws.on('message', function(msg) {
    var others = sockets.filter(socket => socket !== ws);
    for (const socket of others) {
      socket.send(msg);
    }
  });

  ws.on('close', function(code, reason) {
    console.log("Socket removed");
    sockets = sockets.filter(socket => socket !== ws)
  });
});