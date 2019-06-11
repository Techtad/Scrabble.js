var Ui = {
    clicks: function () {
        $("#hideUI").on("click", function () {
            $("#ui").css("display", "none")
            $("#showUI").css("display", "block")
            $("#hiddenUI").css("display", "block")
        })

        $("#showUI").on("click", function () {
            $("#ui").css("display", "block")
            $("#showUI").css("display", "none")
            $("#hiddenUI").css("display", "none")
        })

        $("#hideScr").on("click", function () {
            $("#scoreboard").css("display", "none")
            $("#showScr").css("display", "block")
            $("#hiddenScr").css("display", "block")
        })

        $("#showScr").on("click", function () {
            $("#scoreboard").css("display", "block")
            $("#showScr").css("display", "none")
            $("#hiddenScr").css("display", "none")
        })

        $("#letterGet").on("click", function () {
            var count = 15
            var start = setInterval(function () {
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
            $("#scoreboard-content").html("<h3>" + Game.scoreboard.myName + " : " + Game.scoreboard.myScore + "</h3>" + "<h3>" + Game.scoreboard.opponentName + " : " + Game.scoreboard.opponentScore + "</h3>")
        })

        $("#exchangeMode").on("click", function () {
            if (!Game.exchange) {
                $(this).text("CANCEL REDRAWING")
                $("#exchange").prop("disabled", false)
                if (Game.skipCount == 3) $("#exchange").css("background-color", "red")
                else $("#exchange").css("background-color", "")
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
                $("#exchange").css("background-color", "")
                $("#skip").prop("disabled", false)
                Game.exchange = false
                for (var count = 0; count < Game.exchangeTab.length; count++) {
                    Game.exchangeTab[count].color = "white"
                    Game.exchangeTab[count].material = Game.exchangeTab[count].color
                }
                Game.exchangeTab = []
            }
        })

        $("#exchange").on("click", function () {
            SocketHander.emit("end-turn", { skip: true }, function (data) {
                if (data.success) {
                    Game.exchangeLetters()
                } else alert("You can't exchange letters when it's not your turn!")
            })
        })

        $("#wordReset").on("click", function () {
            Game.resetWord()
        })

        $("#placeWord").on("click", function () {
            if (Game.firstMove) {
                Game.centerCheck()
            } else {
                Game.acceptWord()
            }
        })

        $("#skip").on("click", function () {
            SocketHander.emit("end-turn", { skip: true }, function (data) {
                if (data.success) {
                    /* Game.turnSkipCount += 1
                    if (Game.turnSkipCount >= 2) {
                        alert("Round was skipped twice! Game over!")
                        $("#letterGet").prop("disabled", true)
                        $("#placeWord").prop("disabled", true)
                        $("#wordReset").prop("disabled", true)
                        $("#exchangeMode").prop("disabled", true)
                        $("#exchange").prop("disabled", true)
                        $("#skip").prop("disabled", true)
                    } */
                } else alert("You can't skip the turn when it's not your turn!")
            })

        })

        $("#root").on("mousedown", function (event) {
            Game.rayClick(event)
        })
    },

    blockEverything: function () {
        $("#letterGet").prop("disabled", true)
        $("#placeWord").prop("disabled", true)
        $("#wordReset").prop("disabled", true)
        $("#exchangeMode").prop("disabled", true)
        $("#exchange").prop("disabled", true)
        $("#skip").prop("disabled", true)
        $("#exchange").css("background-color", "")
        $("#exchangeMode").text("REDRAW LETTERS")
    },

    setOverlay: function (msg, opacity) {
        $("#overlayMessage").text(msg)
        $("#overlay").css("background-color", `rgba(0, 0, 0, ${opacity})`)
        $("#overlay").css("display", "block")
    },

    removeOverlay: function () {
        $("#overlayMessage").empty()
        $("#overlay").css("display", "none")
    }
}