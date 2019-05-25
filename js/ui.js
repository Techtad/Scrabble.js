var Ui = {
    clicks: function() {
        $("#letterGet").on("click", function() {
            Game.giveLetter()
        })

        $("#wordReset").on("click", function() {
            Game.resetWord()
        })

        $("#placeWord").on("click", function() {
            if (Game.firstMove) {
                Game.centerCheck()
            } else {
                Game.acceptWord()
            }
        })

        $("#root").on("click", function() {
            Game.rayClick()
        })
    }
}