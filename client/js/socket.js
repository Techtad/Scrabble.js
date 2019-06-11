var EventList = ["check-word",
    "session-joined", "session-closed",
    "send-score", "get-scores", "score-update",
    "send-board", "get-board", "board-update",
    "send-nickname", "get-nicknames", "nickname-update",
    "whose-turn", "end-turn", "turn-update",
    "start-game", "game-over"
]

var SocketHander = {
    client: null,
    init: function (socket) {
        this.client = socket
        this.responseHandlers()

        this.addResponseCallback("session-joined", function (data) {
            if (data.myTurn) {
                Game.myTurn = true
                //Game.firstMove = true
                console.log("teraz moja tura")
            } else {
                Game.myTurn = false
                //Game.firstMove = false
                console.log("już nie moja tura")
            }
        })
        this.addResponseCallback("session-closed", function (data) {
            SocketHander.client.emit("return-to-lobby")
            Game.myTurn = false
            Ui.blockEverything()
            $("#turnStatus").text(`SESSION CLOSED!`)
            $("#turnStatus").css("color", "black")
            $("<div>").text(data.reason).dialog({
                title: "Session Closed",
                modal: true,
                close: function (event, ui) {
                    Game.reset()
                    Game.pause()
                    Lobby.reveal()
                    $(this).remove()
                },
                buttons: {
                    "Return to Lobby": function (event, ui) {
                        $(this).dialog("close")
                    },
                }
            })

        })

        this.addResponseCallback("start-game", function (data) {
            var count = 15
            var start = setInterval(function () {
                if (count <= 0) {
                    clearInterval(start)
                } else {
                    Game.giveLetter()
                    count--
                }
            }, 100)
            // $("#letterGet").click()
        })
        this.addResponseCallback("game-over", function (data) {
            Ui.blockEverything()
            let msg = `Game over!<br>${data.draw ? "It's a draw!" : `${data.winner} won!`}`
            $("#turnStatus").text(msg.toUpperCase())
            $("#turnStatus").css("color", "darkblue")
            $("<div>").text(`${data.draw ? "It's a draw!" : `${data.winner} won!`}`).dialog({
                title: "Game Over!",
                modal: true,
                close: function (event, ui) {
                    Game.reset()
                    Game.pause()
                    Lobby.reveal()
                    $(this).remove()
                },
                buttons: {
                    "Return to Lobby": function (event, ui) {
                        $(this).dialog("close")
                    },
                }
            })
        })

        this.addResponseCallback("score-update", function (data) {
            //console.log("tutaj będzie wyświetlanie zaktualizowanych wyników", data)
            Game.scoreboard.myScore = parseInt(data.mine)
            Game.scoreboard.opponentScore = parseInt(data.opponents)

            $("#scoreboard-content").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")
        })
        this.addResponseCallback("board-update", function (data) {
            //console.log("tutaj będzie aktualizacja planszy", data)
            Game.updateBoard(data.board)
        })
        this.addResponseCallback("nickname-update", function (data) {
            //console.log("otrzymano info o nazwach graczy", data)
            if (data.mine != "") Game.scoreboard.myName = data.mine
            if (data.opponents != "") Game.scoreboard.opponentName = data.opponents

            $("#scoreboard-content").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")

            if (data.opponents != "") {
                if (Game.myTurn) {
                    $("#exchangeMode").prop("disabled", false)
                    $("#skip").prop("disabled", false)
                    $("#turnStatus").text("YOUR TURN")
                    $("#turnStatus").css("color", "green")
                } else {
                    $("#exchangeMode").prop("disabled", true)
                    $("#skip").prop("disabled", true)
                    $("#turnStatus").text(`${Game.scoreboard.opponentName.toUpperCase()}'S TURN`)
                    $("#turnStatus").css("color", "red")
                }

                Lobby.hide()
                Game.resume()
            }
        })
        this.addResponseCallback("turn-update", function (data) {
            if (data.myTurn) {
                Game.myTurn = true
                $("#exchangeMode").prop("disabled", false)
                $("#skip").prop("disabled", false)
                $("#turnStatus").text("YOUR TURN")
                $("#turnStatus").css("color", "green")
                console.log("teraz moja tura")
                if (data.centerTaken) Game.firstMove = false
                console.log(data.centerTaken)
                console.log(Game.firstMove)
            } else {
                Game.myTurn = false
                $("#exchangeMode").prop("disabled", true)
                $("#skip").prop("disabled", true)
                $("#turnStatus").text(`${Game.scoreboard.opponentName.toUpperCase()}'S TURN`)
                $("#turnStatus").css("color", "red")
                if (data.centerTaken) Game.firstMove = false
                console.log(data.centerTaken)
                console.log(Game.firstMove)

            }
            $("#lastMove").css("color", data.lastMoveColor)
            $("#lastMove").html(data.lastMoveMsg)
        })
    },

    callbacks: [],
    responseHandlers: function () {
        for (let event of EventList) {
            this.client.on(event + "-resp", function (data) {
                console.log("Event socketowy: " + event, data)
                if (SocketHander.callbacks[event]) SocketHander.callbacks[event](data)
            })
        }
    },

    emit: function (event, data, callback) {
        if (!EventList.includes(event)) { console.log(`Niepoprawny event socketowy: ${event}`); return }

        if (callback) this.callbacks[event] = callback
        this.client.emit(event, data)
    },

    addResponseCallback(event, callback) {
        if (!EventList.includes(event)) { console.log(`Niepoprawny event socketowy: ${event}`); return }

        this.callbacks[event] = callback
    }
}