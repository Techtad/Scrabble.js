var http = require("http")
var socketio = require("socket.io")
var RequestHandler = require("./server/modules/getpost.js")

var server = http.createServer(function (req, res) {
    console.log(req.method + " : " + req.url)
    switch (req.method) {
        case "GET":
            RequestHandler.sendFile(__dirname, decodeURI(req.url).split('?')[0], res)
            break;
        case "POST":
            RequestHandler.postRepsonse(req, res)
            break;
    }
})

const port = 3000
server.listen(3000, function () {
    console.log("Start serwera na porcie " + port)
})

var SocketServer = socketio.listen(server)
console.log("Start Socket.io")

var SocketHandler = require("./server/modules/sockethandler.js")(SocketServer)