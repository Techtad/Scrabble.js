var Ui = {
    clicks: function() {
        $("#letterGet").on("click", function() {
            var count = 15
            var start = setInterval(function() {
                if (count <= 0) {
                    clearInterval(start)
                } else {
                    Game.giveLetter()
                    count--
                }

            }, 100)
            $("#letterGet").prop("disabled", true)
            $("#exchangeMode").prop("disabled", false)
            $("#skip").prop("disabled", false)
            $("#scoreboard").html("<h3>" + Game.scoreboard.player + " : " + Game.scoreboard.score + "</h3>")

        })

        $("#exchangeMode").on("click", function() {
            if (!Game.exchange) {
                $(this).text("CANCEL REDRAWING")
                $("#exchange").prop("disabled", false)
                $("#skip").prop("disabled", true)
                Game.exchange = true
                if (Game.selectedLetter) {
                    Game.selectedLetter.color = "white"
                    Game.selectedLetter.material = Game.selectedLetter.color
                    Game.selectedLetter = null
                }

            } else {
                $(this).text("REDRAW LETTERS")
                $("#exchange").prop("disabled", true)
                $("#skip").prop("disabled", false)
                Game.exchange = false
                for (var count = 0; count < Game.exchangeTab.length; count++) {
                    Game.exchangeTab[count].color = "white"
                    Game.exchangeTab[count].material = Game.exchangeTab[count].color
                }
                Game.exchangeTab = []
            }
        })

        $("#exchange").on("click", function() {
            Game.exchangeLetters()
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

        $("#skip").on("click", function() {
            Game.turnSkipCount += 1
            if (Game.turnSkipCount >= 2) {
                alert("Round was skipped twice! Game over!")
                $("#letterGet").prop("disabled", true)
                $("#placeWord").prop("disabled", true)
                $("#wordReset").prop("disabled", true)
                $("#exchangeMode").prop("disabled", true)
                $("#exchange").prop("disabled", true)
                $("#skip").prop("disabled", true)
            }
        })

        $("#root").on("click", function() {
            Game.rayClick()
        })
    }
}