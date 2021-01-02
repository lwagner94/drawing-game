
import getWordlists from "./wordlists.mjs";
import { v4 as uuidv4 } from 'uuid';

import morgan from "morgan";
import express from "express"
const app = express()
import expressWs from "express-ws"

expressWs(app)


const port = 3000

app.use(express.static('../frontend/src'));
app.use(express.static('../common'));
app.use(express.json());
app.use(morgan("tiny"));


var games = [];


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

app.get("/api/wordlists", (req, res) => {
    res.json(getWordlists());
});


app.post("/api/game", (req, res) => {
    const body = req.body;
    if (!body.hasOwnProperty("wordlist") || 
        !body.hasOwnProperty("numberOfPlayers") ||
        !body.hasOwnProperty("rounds") ||
        !body.wordlist.hasOwnProperty("title") || 
        !body.wordlist.hasOwnProperty("words") ||
        typeof(body.numberOfPlayers) !== "number" || 
        typeof(body.rounds) !== "number") {
        
        res.sendStatus(400);
        return;
    }

    const game = new Object();

    game.gameId = uuidv4();
    game.wordlist = body.wordlist;
    game.numberOfPlayers = body.numberOfPlayers;
    game.rounds = body.rounds;
    game.users = [];

    games.push(game);

    res.location("/api/game/" + game.gameId);
    res.status(201).json(game);
});

app.get("/api/game/:gameId", (req, res) => {
    for (const game of games) {
        if (game.gameId === req.params.gameId) {
            res.json(game);
            return;
        }
    }

    res.sendStatus(404);
});

app.delete("/api/game/:gameId", (req, res) => {
    var found = false;

    games = games.filter(game => {
        if (game.gameId !== req.params.gameId) {
            return true;
        }
        else {
            found = true;
            return false;
        }
        
    });

    if (found) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
});


app.post("/api/game/:gameId/join", (req, res) => {
    const body = req.body;
    if (!body.hasOwnProperty("userName") || 
        typeof(body.userName) !== "string") {
        res.sendStatus(400);
        return;
    }

    const game = games.find(game => game.gameId === req.params.gameId);

    if (!game) {
        res.sendStatus(404);
        return;
    }

    if (game.users.length >= game.numberOfPlayers) {
        res.sendStatus(400);
        return;
    }

    const user = new Object();

    user.userName = body.userName;
    user.userId = uuidv4();

    game.users.push(user);

    res.status(201).json(user);

});

app.delete("/api/game/:gameId/join/:userId", (req, res) => {

});

var sockets = [];

app.ws('/api/socket', function (ws, req) {
    console.log("New socket!");
    sockets.push(ws);

    ws.on('message', function (msg) {
        var others = sockets.filter(socket => socket !== ws);
        for (const socket of others) {
            socket.send(msg);
        }
    });

    ws.on('close', function (code, reason) {
        console.log("Socket removed");
        sockets = sockets.filter(socket => socket !== ws)
    });
});