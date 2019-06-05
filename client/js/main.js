var Program = {
    init: function () {
        Game.init()
        SocketHander.init(new io())
    }
}

window.addEventListener("DOMContentLoaded", function (event) {
    Program.init()
    Game.start()
    Ui.clicks()
})