var EventList = ["check-word",
    "session-joined", "session-closed",
    "send-score", "get-scores", "score-update",
    "send-board", "get-board", "board-update"]

var SocketHander = {
    client: null,
    init: function (socket) {
        this.client = socket
        this.responseHandlers()
        this.addResponseCallback("score-update", function (data) {
            console.log("tutaj będzie wyświetlanie zaktualizowanych wyników", data)
        })
        this.addResponseCallback("board-update", function (data) {
            console.log("tutaj będzie aktualizacja planszy", data)
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

        this.callbacks[event] = callback
        this.client.emit(event, data)
    },

    addResponseCallback(event, callback) {
        if (!EventList.includes(event)) { console.log(`Niepoprawny event socketowy: ${event}`); return }

        this.callbacks[event] = callback
    }
}