var fs = require("fs")
var FilesDir = "client"

module.exports = { //RequestHandler
    sendFile: function (__dirname, fileName, res) {
        if (fileName == "/") fileName = "/lobby.html"
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
    },

    postRepsonse: function (req, res) {
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
}