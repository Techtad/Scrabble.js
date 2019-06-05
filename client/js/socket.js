var SocketHander = {
    client: null,
    init: function (socket) {
        this.client = socket
        this.responseHandlers()
    },

    responseHandlers: function () {
        this.client.on("check-word-resp", function (data) {
            console.log("check-word", data)
            alert(`Słowo '${data.word}' jest ${data.answer ? "poprawne" : "niepoprawne"}!`)
        })
    },

    emit: function (event, data) {
        this.client.emit(event, data)
    }
}