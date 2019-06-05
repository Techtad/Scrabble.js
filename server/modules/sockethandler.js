var DatabaseHandler = require(__dirname + "/dbhandler.js")
var SocketServer

module.exports = function (SocketServer) { //SocketHandler
    //init
    SocketServer = SocketServer

    SocketServer.on("connection", function (client) {
        console.log("Klient się połączył:", client.id)
        client.on("disconnect", function () {
            console.log("Klient się rozłączył:", this.id)
        })

        client.on("check-word", function (data) {
            DatabaseHandler.isWord(data.word).then(function (answer) {
                client.emit("check-word-resp", { word: data.word, answer: answer })
            })
        })
    })

    //dodatkowe funkcje
    return {}
}