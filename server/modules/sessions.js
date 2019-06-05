var GameManager = require(__dirname + "/game.js")

class Session {
    constructor(id) {
        this.id = id
        this.clientA = null
        this.clientB = null
        this.alive = true
        this.started = false

        this.game = new GameManager.Game()
    }

    getGame() {
        return this.game
    }

    acceptClient(client) {
        if (!this.hasRoom()) {
            console.log(`Klient ${client.id} próbował dołączyć do pełnej sesji o id ${this.id}`)
            return
        }
        if (this.clientA == null) this.clientA = client
        else if (this.clientB == null) {
            this.clientB = client
            this.started = true
        }
        client.emit("session-joined-resp", { sessionId: this.id })
    }

    hasRoom() {
        return this.clientA == null || this.clientB == null
    }

    hasClientId(clientId) {
        return (this.clientA && this.clientA.id == clientId) || (this.clientB && this.clientB.id == clientId)
    }

    clientLeft(client) {
        if (this.hasClientId(client.id)) {
            if (this.clientA && this.clientA.id == client.id && this.clientB) this.clientB.emit("session-closed-resp", { reason: "The other player has left the game" })
            else if (this.clientB && this.clientB.id == client.id && this.clientA) this.clientA.emit("session-closed-resp", { reason: "The other player has left the game" })
        }
        this.kill()
    }

    kill() {
        this.alive = false
        SessionList[this.id] = null
        delete SessionList[this.id]
    }
}

var SessionList = []
var LastSessionId = 0

module.exports = function () { //SessionManager
    //init

    //dodatkowe funkcje
    return {
        acceptClient: function (client) {
            for (let s of SessionList) {
                if (s && s.hasClientId(client.id)) return
            }

            if (SessionList[LastSessionId] && SessionList[LastSessionId].hasRoom()) {
                SessionList[LastSessionId].acceptClient(client)
            } else {
                LastSessionId++
                SessionList[LastSessionId] = new Session(LastSessionId)
                SessionList[LastSessionId].acceptClient(client)
            }
            //console.log(SessionList)
        },

        clientLeft: function (client) {
            let session = this.getSessionByClientId(client.id)
            if (session) session.clientLeft(client)
        },

        getSessionByClientId: function (clientId) {
            for (let s of SessionList) {
                if (s && s.hasClientId(clientId)) return s
            }
            return null
        }
    }
}