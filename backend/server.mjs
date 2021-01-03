
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

// Automatically parse json body
app.use(express.json());

// Request logging
app.use(morgan("tiny"));

const TIME_PER_ROUND = 60;


let games = [];
let socketMap = new Map();


games.push({
    "gameId": "game",
    "wordlist": {
        "title": "Fruits",
        "words": [
            "word1",
            "word2"
        ]
    },
    "numberOfPlayers": 4,
    "rounds": 3,
    "currentRound": 0,
    "started": false,
    "finished": false,
    "timeLeft": TIME_PER_ROUND,
    "currentWordIndex": 0,
    "wordHintIndices": [],
    "users": [
        {
            "userName": "Hans",
            "userId": "user1",
            "ready": false,
            "score": 0,
            "drawing": true,
            "guessed": false,
            "socketConnected": false
        },
        {
            "userName": "Fritz",
            "userId": "user2",
            "ready": false,
            "score": 0,
            "drawing": false,
            "guessed": false,
            "socketConnected": false
        }
    ]
});




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
    game.currentRound = 0;
    game.started = false;
    game.finished = false;
    game.currentWordIndex = 0,
    game.wordHintIndices = [],
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
    user.ready = false;
    user.score = 0;
    user.drawing = false;
    user.socketConnected = false;

    game.users.push(user);

    sendCurrentUserList(game);


    res.status(201).json(user);

});



app.delete("/api/game/:gameId/join/:userId", (req, res) => {
    // TODO: Do we really need this?
});


function findGameAndUserByUserId(userId) {
    for (const game of games) {
        for (const user of game.users) {
            if (userId === user.userId) {
                return [game, user];
            }
        }
    }

    return null;
}

function sendCurrentUserList(game) {
    const temp = new Object();
    temp.type = "USERLIST_UPDATE";
    temp.payload = game.users;


    sendToAllUsers(game, JSON.stringify(temp));
}

function sendToOtherUsers(game, user, text) {
    for (const other_user of game.users) {
        let s = socketMap.get(other_user.userId);

        if (other_user !== user && s !== undefined) {
            s.send(text);
        }
    }
}

function sendToAllUsers(game, text) {
    for (const user of game.users) {
        let s = socketMap.get(user.userId);

        if (s !== undefined) {
            s.send(text);
        }
    }
}

function sendRoundUpdate(game) {
    const temp = new Object();
    temp.type = "ROUND_UPDATE";
    temp.payload = {
        "started": game.started,
        "finished": game.finished,
        "currentRound": game.currentRound,
        "numberOfRounds": game.rounds
    };

    sendToAllUsers(game, JSON.stringify(temp));
}

function randomIntegerInRange(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

setInterval(() => {
    for (const game of games) {
        if (game.started) {
            gameUpdate(game);
        }
    }
    
}, 1000);

function gameUpdate(game) {
    const msg = new Object();

    msg.type = "GAME_UPDATE";
    msg.payload = {
        "currentWord": game.wordlist.words[game.currentWordIndex],
        "wordHintIndices": game.wordHintIndices,
        "timeLeft": --game.timeLeft,
    };

    sendToAllUsers(game, JSON.stringify(msg));

    const wordLength = game.wordlist.words[game.currentWordIndex].length;
    const secondsBeforeNextHint = TIME_PER_ROUND / wordLength;

    if (game.timeLeft % secondsBeforeNextHint == 0 && wordLength != game.wordHintIndices.length) {
        while (true) {
            let randomIndex = randomIntegerInRange(0, wordLength - 1);
            if (!game.wordHintIndices.includes(randomIndex)) {
                game.wordHintIndices.push(randomIndex);
                break;
            }
        }
    }

    const everybodyGuessed = game.users.every(u => u.guessed || u.drawing);

    if (game.timeLeft <= 0 || everybodyGuessed) {
        // Next round
        game.timeLeft = TIME_PER_ROUND;

        // Pick next user
        const currentlyDrawingIndex = game.users.findIndex((u) => u.drawing);
        const newCurrentlyDrawingINdex = (currentlyDrawingIndex + 1) % game.users.length;

        if (newCurrentlyDrawingINdex === 0) {
            game.currentRound++;

            if (game.currentRound > game.rounds) {
                game.finished = true;
            }

            sendRoundUpdate(game);
        }

        

        // Randomly choose next word
        game.currentWordIndex = randomIntegerInRange(0, game.wordlist.words.length - 1);
        game.wordHintIndices = [];

        game.users[currentlyDrawingIndex].drawing = false;
        game.users[newCurrentlyDrawingINdex].drawing = true;

        game.users.forEach(u => u.guessed = false);

        sendCurrentUserList(game);
        
    }
}

function startGame(game) {
    game.timeLeft = TIME_PER_ROUND;
    game.started = true;
    game.currentRound = 1;
 
    game.currentWordIndex = randomIntegerInRange(0, game.wordlist.words.length - 1);
    game.wordHintIndices = [];

    game.users[0].drawing = true;
    game.users.forEach(u => u.guessed = false);

    sendRoundUpdate(game);
}


app.ws('/api/socket', function (ws, req) {
    console.log("New socket connected");
    // sockets.push(ws);

    ws.on('message', function (text) {
        const msg = JSON.parse(text);

        if (msg.type === "HELLO") {
            console.log("Received HELLO, associating socket with user");
            const [game, user] = findGameAndUserByUserId(msg.payload.userId);

            user.socketConnected = true;

            socketMap.set(user.userId, ws);
            sendCurrentUserList(game);
        }
        else if (msg.type === "CANVAS_CONTENT") {
            const [game, user] = findGameAndUserByUserId(msg.payload.userId);

            if (!user.drawing) {
                console.log(`user ${user.userName} is trying to draw even though it's not their turn`);
                return;
            }

            sendToOtherUsers(game, user, text);
        }
        else if (msg.type === "CHAT_MESSAGE") {
            const [game, user] = findGameAndUserByUserId(msg.payload.userId);
            if (user.drawing) {
                console.log(`user ${user.userName} is trying to chat even though it's their turn to draw`);
                return;
            }

            if (user.guessed) {
                return;
            }

            if (msg.payload.message.trim().toLowerCase() === game.wordlist.words[game.currentWordIndex]) {
                msg.payload.message = "has guessed the word!";
                user.score += game.timeLeft; // TODO
                user.guessed = true;

                sendCurrentUserList(game);

            }

            sendToOtherUsers(game, user, JSON.stringify(msg));
        }
        else if (msg.type === "READY_STATE") {
            const [game, user] = findGameAndUserByUserId(msg.payload.userId);
            user.ready = msg.payload.ready;

            sendCurrentUserList(game);

            const everybodyReady = game.users.every(u => u.ready);
            if (everybodyReady) {
                startGame(game);
            }            
        }
        else {
            console.log("Invalid message!");
        }
    });

    ws.on('close', function (code, reason) {
        for (let [userId, socket] of socketMap) {
            if (socket === ws) {
                console.log(`Removing socket of ${userId} from socketMap`);
                socketMap.delete(userId);

                const [game, user] = findGameAndUserByUserId(userId);

                user.socketConnected = false;
                sendCurrentUserList(game);
                break;
            }
        }
    });
});