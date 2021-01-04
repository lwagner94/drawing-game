
# Create/query a game
  - POST /api/game Create a new game
    - Parameters, as a JSON string:
      {
        wordlist: 
          {"title" : "Fruit"
           "words": ["word1", "word2"]
          },
        numberOfPlayers: 4,
        rounds: 3,
      }
    - Return 201 Created, payload: 
      {
        gameId: "<gameId>",
        wordlist: 
          {"title" : "Fruit"
           "words": ["word1", "word2"]
          },
        numberOfPlayers: 4,
        rounds: 3,
        users: []
      }
    - Return 400 Bad Request for invalid requests

  - GET /api/game/<gameId> Fetch info about game
    - Return 200 Ok, payload
      {
        wordlistTitle: "title",
        numberOfPlayers: 4,
        rounds: 3
      }
    - Return 404 Not Found for invalid ids
      {
        message: "error message"
      }
  - DELETE /api/game/<gameId> Remove game
    - Return 200 Ok, payload
      {}
    - Return 404 Not Found for invalid ids
      {
        message: "error message"
      }


# 
  - POST /api/game/<gameId>/join Join a game
    - Parameters, as a JSON string:
      {
        "userName": "sepp",
      }
    - Return 201 Created, payload: 
      {
        userId: "<gameId>"
      }
    - Return 400 Bad Request for invalid requests, payload: 
      {
        message: "error message"
      }
    - Return 404 Not Found for invalid gameIds
      {
        message: "error message"
      }
  - DELETE /api/<gameId>/join/<userId> Leave a game
    - Return 200 Ok, payload
      {}
    - Return 404 Not Found for invalid ids
      {
        message: "error message"
      }


  - GET /api/wordlists Get available global word lists
    - Return 200 Ok, payload:
      {["title": "Foods", words: ["apple", "pancake"]]}

/api/socket
  - Structure: 
    {
      "type": "<type>"
      "payload": "<payload>
    }
  - Clients to server:
    - HELLO
      - payload: {"userId": "<userId>"}
    - CANVAS_CONTENT
      - payload: {"userId": "<userId>, "image": "<image as base64 data URL>"}
    - CHAT_MESSAGE
      - payload: {"userId": "<userId>", "message": "<message>"}
    - READY_STATE
      - payload: {"userId": "<userId>", "ready": "true/false"}

  - Server to clients
    - CANVAS_CONTENT
      - payload: {"userId": "<userId>, "image": "<image as base64 data URL>"}
    - CHAT_MESSAGE
      - payload: {"userId": "<userId>", "message": "<message>"}
    - USERLIST_UPDATE
      - payload:  [
          {
            "userId": <str>,
            "userName": <str>,
            "ready": <bool>,
            "score": <num>,
            "drawing": <bool>   // who is currently drawing?
            "guessed": <bool> // user has already guessed the word
          }, ...
        ]
    - ROUND_UPDATE
      payload: {
        "started": bool,
        "finished": bool,
        "currentRound": number,
        "numberOfRounds": number
      }
    - GAME_UPDATE
      - payload: 
        {
          "currentWord": <str>, // Curent word as a string
          "wordHintIndices": [<num>, ], // Indices of the characters that should currently be shown
          "timeLeft": <num> // time left in seconds
        }
