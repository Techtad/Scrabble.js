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

            if (client.id == Session.clientA.id) {
                Game.setScoreA(data.score)
                let scores = Game.getScores()
                Session.clientB.emit("score-update-resp", { mine: scores.b, opponents: scores.a })
            }
            else if (Session.clientB && client.id == Session.clientB.id) {
                Game.setScoreB(data.score)
                let scores = Game.getScores()
                Session.clientA.emit("score-update-resp", { mine: scores.a, opponents: scores.b })
            }

            client.emit("send-score-resp", { success: true })
        })
        client.on("get-scores", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            let scores = Game.getScores()
            if (client.id == Session.clientA.id) client.emit("get-scores-resp", { mine: scores.a, opponents: scores.b })
            else if (Session.clientB && client.id == Session.clientB.id) client.emit("get-scores-resp", { mine: scores.b, opponents: scores.a })
        })

        client.on("send-board", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            if (data.board) {
                Game.setBoard(data.board)
                client.emit("send-board-resp", { success: true })
                if (client.id == Session.clientA.id) Session.clientB.emit("board-update-resp", { board: Game.getBoard() })
                else if (Session.clientB && client.id == Session.clientB.id) Session.clientA.emit("board-update-resp", { board: Game.getBoard() })
            } else
                client.emit("send-board-resp", { success: false })
        })
        client.on("get-board", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            client.emit("get-board-resp", { board: Game.getBoard() })
        })

        client.on("send-nickname", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            if (!data.nickname) client.emit("send-nickname-resp", { accepted: false })
            if (client.id == Session.clientA.id) {
                if (Game.getNicknames().b == data.nickname) client.emit("send-nickname-resp", { accepted: false })
                else {
                    Game.setNicknameA(data.nickname)
                    client.emit("send-nickname-resp", { accepted: true })
                    let nicknames = Game.getNicknames()
                    if (Session.clientB) Session.clientB.emit("nickname-update-resp", { mine: nicknames.b, opponents: nicknames.a })
                }
            }
            else if (Session.clientB && client.id == Session.clientB.id) {
                if (Game.getNicknames().a == data.nickname) client.emit("send-nickname-resp", { accepted: false })
                else {
                    Game.setNicknameB(data.nickname)
                    client.emit("send-nickname-resp", { accepted: true })
                    let nicknames = Game.getNicknames()
                    Session.clientA.emit("nickname-update-resp", { mine: nicknames.a, opponents: nicknames.b })
                    Session.clientB.emit("nickname-update-resp", { mine: nicknames.b, opponents: nicknames.a })
                }
            }
        })
        client.on("get-nicknames", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            let nicknames = Game.getNicknames()
            if (client.id == Session.clientA.id) client.emit("get-nicknames-resp", { mine: nicknames.a, opponents: nicknames.b })
            else if (Session.clientB && client.id == Session.clientB.id) client.emit("get-nicknames-resp", { mine: nicknames.b, opponents: nicknames.a })
        })
    })

    //dodatkowe funkcje
    return {}
}