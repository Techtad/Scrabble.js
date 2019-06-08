var EventList = ["check-word",
    "session-joined", "session-closed",
    "send-score", "get-scores", "score-update",
    "send-board", "get-board", "board-update",
    "send-nickname", "get-nicknames", "nickname-update",
    "whose-turn", "end-turn", "turn-update"]

var SocketHander = {
    client: null,
    init: function (socket) {
        this.client = socket
        this.responseHandlers()

        this.addResponseCallback("session-joined", function (data) {
            if (data.myTurn) console.log("teraz moja tura")
            else console.log("już nie moja tura")
        })
        this.addResponseCallback("session-closed", function (data) {
            alert(`Session closed, reason: ${data.reason}`)
        })

        this.addResponseCallback("score-update", function (data) {
            //console.log("tutaj będzie wyświetlanie zaktualizowanych wyników", data)
            Game.scoreboard.myScore = parseInt(data.mine)
            Game.scoreboard.opponentScore = parseInt(data.opponents)
            $("#scoreboard").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")
        })
        this.addResponseCallback("board-update", function (data) {
            //console.log("tutaj będzie aktualizacja planszy", data)
            Game.updateBoard(data.board)
        })
        this.addResponseCallback("nickname-update", function (data) {
            //console.log("otrzymano info o nazwach graczy", data)
            Game.scoreboard.myName = data.mine
            Game.scoreboard.opponentName = data.opponents
            $("#scoreboard").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")
        })
        this.addResponseCallback("turn-update", function (data) {
            if (data.myTurn) console.log("teraz moja tura")
            else console.log("już nie moja tura")
        })

        this.addResponseCallback("send-nickname", function (data) {
            if (!data.accepted) {
                let nick = prompt("Nickname taken, try again:")
                SocketHander.emit("send-nickname", { nickname: nick })
            }
        })

        let nick = prompt("Enter nickname:")
        while (!nick) nick = prompt("Enter non-empty nickname:")
        SocketHander.emit("send-nickname", { nickname: nick })
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