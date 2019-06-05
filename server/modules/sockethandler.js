var DatabaseHandler = require(__dirname + "/dbhandler.js")
var SessionManager = require(__dirname + "/sessions.js")()
var SocketServer

module.exports = function (SocketServer) { //SocketHandler
    //init
    SocketServer = SocketServer

    SocketServer.on("connection", function (client) {
        SessionManager.acceptClient(client)
        console.log("Klient się połączył:", client.id)
        client.on("disconnect", function () {
            SessionManager.clientLeft(client)
            console.log("Klient się rozłączył:", this.id)
        })

        client.on("check-word", function (data) {
            DatabaseHandler.isWord(data.word).then(function (answer) {
                client.emit("check-word-resp", { word: data.word, answer: answer })
            })
        })

        client.on("send-score", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            if (client.id == Session.clientA.id) Game.setScoreA(data.score)
            else if (client.id == Session.clientB.id) Game.setScoreB(data.score)

            client.emit("send-score-resp", { success: true })
        })
        client.on("get-scores", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            let scores = Game.getScores()
            if (client.id == Session.clientA.id) client.emit("get-scores-resp", { mine: scores.a, opponents: scores.b })
            else if (client.id == Session.clientB.id) client.emit("get-scores-resp", { mine: scores.b, opponents: scores.a })
        })
    })

    //dodatkowe funkcje
    return {}
}