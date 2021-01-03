
// TODO: Error handling?

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export function getWordlists() {
    return fetch("/api/wordlists")
    .then(handleErrors)
    .then(result => result.json())
}

export function createGame(numberOfPlayers, numberOfRounds, wordlist) {
    return fetch("/api/game", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rounds: numberOfRounds, 
            numberOfPlayers: numberOfPlayers,
            wordlist: wordlist
        })
    })
    .then(handleErrors)
    .then(result => result.json());
}

export function getGame(gameId) {
    return fetch(`/api/game/${gameId}`)
    .then(handleErrors)
    .then(result => result.json())
}

export function joinGame(gameId, userName) {
    return fetch(`/api/game/${gameId}/join`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userName,
        })
    })
    .then(handleErrors)
    .then(result => result.json());
}