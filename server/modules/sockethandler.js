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

            let names = Game.getNicknames()
            if (names.a && names.a.length > 0 && names.b && names.b.length > 0) {
                Session.clientA.emit("start-game-resp")
                Session.clientB.emit("start-game-resp")
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

        client.on("whose-turn", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            if (client.id == Session.clientA.id) client.emit("whose-turn-resp", { myTurn: Game.playerATurn() })
            else if (Session.clientB && client.id == Session.clientB.id) client.emit("whose-turn-resp", { myTurn: Game.playerBTurn() })
        })
        client.on("end-turn", function (data) {
            let Session = SessionManager.getSessionByClientId(client.id)
            if (!Session) return
            let Game = Session.getGame()

            if (client.id == Session.clientA.id) {
                if (Game.playerATurn()) {
                    Game.nextTurn()
                    client.emit("end-turn-resp", { success: true })

                    Session.clientA.emit("turn-update-resp", { myTurn: Game.playerATurn() })
                    if (Session.clientB) Session.clientB.emit("turn-update-resp", { myTurn: Game.playerBTurn() })

                    if (data.skip) Game.playerASkipped++
                    else Game.playerASkipped = 0
                }
                else client.emit("end-turn-resp", { success: false })
            }
            else if (Session.clientB && client.id == Session.clientB.id) {
                if (Game.playerBTurn()) {
                    Game.nextTurn()
                    client.emit("end-turn-resp", { success: true })

                    if (Session.clientA) Session.clientA.emit("turn-update-resp", { myTurn: Game.playerATurn() })
                    Session.clientB.emit("turn-update-resp", { myTurn: Game.playerBTurn() })

                    if (data.skip) Game.playerBSkipped++
                    else Game.playerBSkipped = 0
                }
                else client.emit("end-turn-resp", { success: false })
            }

            if (Game.playerASkipped == 2 && Game.playerBSkipped == 2) {
                let draw = false
                let winner = null
                let scores = Game.getScores()
                let names = Game.getNicknames()
                if (scores.a == scores.b)
                    draw = true
                else if (scores.a > scores.b)
                    winner = names.a
                else winner = names.b

                Session.clientA.emit("game-over-resp", { draw: draw, winner: winner })
                Session.clientB.emit("game-over-resp", { draw: draw, winner: winner })
            }
        })
    })

    //dodatkowe funkcje
    return {}
}