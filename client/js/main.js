var Program = {
    init: function () {
        Game.init()
        SocketHander.init(new io())
        Ui.clicks()
        Lobby.init()
    }
}

window.addEventListener("DOMContentLoaded", function (event) {
    Program.init()
    Game.start()
    Game.pause()
})