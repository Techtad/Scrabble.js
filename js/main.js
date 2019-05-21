var Program = {
    init: function () {
        Game.init()
    }
}

window.addEventListener("DOMContentLoaded", function (event) {
    Program.init()
    Game.start()
})