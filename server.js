var http = require("http")
var fs = require("fs")
var socketio = require("socket.io")
var sessions = require("./server/sessions.js")

var FilesDir = "client"
function sendFile(fileName, res) {
    if (fileName == "/") fileName = "/index.html"
    fs.readFile(`${__dirname}/${FilesDir}/${fileName}`, function (error, data) {
        if (error) {
            console.log(error)
            res.writeHead(404, { "Content-Type": "text/html;charset=utf-8" })
            res.end(`Błąd 404: Nie znaleziono pliku ${fileName}`)
        } else {
            let nameParts = fileName.split(".")
            let ext = nameParts[nameParts.length - 1].toLowerCase()
            let contentType = "text/html;charset=utf-8"
            switch (ext) {
                case "js":
                    contentType = "application/javascript"
                    break
                case "json":
                    contentType = "application/json"
                    break
                case "css":
                    contentType = "text/css"
                    break
                case "jpg": case "jpeg":
                    contentType = "image/jpeg"
                    break
                case "mp3":
                    contentType = "audio/mpeg"
                    break
                case "png":
                    contentType = "image/png"
                    break
                case "svg":
                    contentType = "image/svg+xml"
                    break
                case "gif":
                    contentType = "image/gif"
                    break
                case "txt":
                    contentType = "text/plain"
                    break
                default: break
            }
            res.writeHead(200, { "Content-Type": contentType })
            res.end(data)
        }
    })
}

function postRepsonse(req, res) {
    let allData = ""
    req.on("data", function (data) {
        allData += data
    })
    req.on("end", function (data) {
        console.log("Data(" + req.url + "):" + allData)
        let obj
        if (allData) {
            try {
                obj = JSON.parse(allData)
            } catch (error) {
                console.log(error)
                res.writeHead(400, { "Content-Type": "text/html;charset=utf-8" })
                res.end(error)
            }
        }
        switch (req.url) {
            default:
                console.log("Błędny POST: " + req.url)
                res.writeHead(400, { "Content-Type": "application/json;charset=utf-8" })
                res.end("Błędna akcja POST: " + req.url)
                break
        }
    })
}

var server = http.createServer(function (req, res) {
    console.log(req.method + " : " + req.url)
    switch (req.method) {
        case "GET":
            sendFile(decodeURI(req.url).split('?')[0], res)
            break;
        case "POST":
            postRepsonse(req, res)
            break;
    }
})

const port = 3000
server.listen(3000, function () {
    console.log("Start serwera na porcie " + port)
})

var socketServer = socketio.listen(server)
console.log("Start Socket.io")