var DatabaseHandler = require(__dirname + "/dbhandler.js")
var SessionManager = require(__dirname + "/sessions.js")()
var Lobby = require(__dirname + "/lobby.js")
var SocketServer

module.exports = function (SocketServer) { //SocketHandler
    //init
    SocketServer = SocketServer

    SocketServer.on("connection", function (client) {
        //SessionManager.acceptClient(client)
        console.log("Klient się połączył:", client.id)
        client.on("disconnect", function () {
            Lobby.clientLeft(client)
            for (let c of Lobby.getClients()) c.emit("lobby-update-resp", { players: Lobby.getPlayerInfo() })

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
            } else if (Session.clientB && client.id == Session.clientB.id) {
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
            if (!data.nickname) { client.emit("send-nickname-resp", { accepted: false, reason: "Nickname cannot be empty" }); return; }
            if (Lobby.getNicknames().includes(data.nickname)) { client.emit("send-nickname-resp", { accepted: false, reason: "Nickname taken, try another one" }); return; }
            if (Lobby.acceptClient(client, data.nickname)) {
                client.emit("send-nickname-resp", { accepted: true })
                for (let c of Lobby.getClients()) c.emit("lobby-update-resp", { players: Lobby.getPlayerInfo() })
            } else { client.emit("send-nickname-resp", { accepted: false, reason: "Failed to join lobby" }); return; }
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

                    Session.clientA.emit("turn-update-resp", { myTurn: Game.playerATurn(), centerTaken: data.centerTaken })
                    if (Session.clientB) Session.clientB.emit("turn-update-resp", { myTurn: Game.playerBTurn(), centerTaken: data.centerTaken })

                    if (data.skip) Game.playerASkipped++
                    else {
                        Game.playerASkipped = 0
                        Game.playerBSkipped = 0
                    }

                } else client.emit("end-turn-resp", { success: false })
            } else if (Session.clientB && client.id == Session.clientB.id) {
                if (Game.playerBTurn()) {
                    Game.nextTurn()
                    client.emit("end-turn-resp", { success: true })

                    if (Session.clientA) Session.clientA.emit("turn-update-resp", { myTurn: Game.playerATurn(), centerTaken: data.centerTaken })
                    Session.clientB.emit("turn-update-resp", { myTurn: Game.playerBTurn(), centerTaken: data.centerTaken })

                    if (data.skip) Game.playerBSkipped++
                    else {
                        Game.playerASkipped = 0
                        Game.playerBSkipped = 0
                    }

                } else client.emit("end-turn-resp", { success: false })
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

                Session.kill()

                Lobby.setPlayerStatusByNickname(names.a, "available")
                Lobby.setPlayerStatusByNickname(names.b, "available")
                for (let c of Lobby.getClients()) c.emit("lobby-update-resp", { players: Lobby.getPlayerInfo() })
            }
        })

        client.on("invite-player", function (data) {
            if (Lobby.getNicknameByClient(client) && Lobby.getClientByNickname(data.nickname)) {
                client.emit("invite-player-resp", { success: true })
                Lobby.getClientByNickname(data.nickname).emit("invitation-resp", { nickname: Lobby.getNicknameByClient(client) })
            } else client.emit("invite-player-resp", { success: false, reason: "Failed to invite player. Reason: Player not in lobby" })
        })
        client.on("invitation-reply", function (data) {
            if (data.agreed) {
                let clientA = Lobby.getClientByNickname(data.nickname)
                let clientB = client
                let session = SessionManager.createSession(clientA, clientB)
                let game = session.getGame()

                let nicknameA = data.nickname
                let nicknameB = Lobby.getNicknameByClient(clientB)

                game.setNicknameA(nicknameA)
                game.setNicknameB(nicknameB)

                clientA.emit("nickname-update-resp", { mine: nicknameA, opponents: nicknameB })
                clientB.emit("nickname-update-resp", { mine: nicknameB, opponents: nicknameA })

                clientA.emit("session-ready-resp")
                clientB.emit("session-ready-resp")

                Lobby.setPlayerStatusByNickname(nicknameA, `Playing against ${nicknameB}`)
                Lobby.setPlayerStatusByNickname(nicknameB, `Playing against ${nicknameA}`)
                for (let c of Lobby.getClients()) c.emit("lobby-update-resp", { players: Lobby.getPlayerInfo() })
            } else {
                Lobby.getClientByNickname(data.nickname).emit("invitaion-rejected-resp")
            }
        })
        client.on("player-ready", function (data) {
            client.emit("start-game-resp")
        })
        client.on("return-to-lobby", function (data) {
            Lobby.setPlayerStatusByClient(client, "available")
            for (let c of Lobby.getClients()) c.emit("lobby-update-resp", { players: Lobby.getPlayerInfo() })
        })
    })

    //dodatkowe funkcje
    return {}
}