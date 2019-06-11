var TutorialStages = [
    { html: "Welcome to Scrabble!<br>This short tutorial will teach you how to play." },
    { html: "Scrabble is a competitive game where the players build words by arraning letter pieces on the tiles of the board." },
    { html: "Each player draws 15 random letter pieces at the beginning of the game.<br>Your pieces are located on your <b>tray</b>.<br>You can select one at any time by clicking it with the <b>Left Mouse Button</b>.", arrow: { pos: ["calc(50vw - 60px)", "66vh"], rot: 90 }, width: 420, pos: { my: "center top", at: "center top+100" } },
    { html: "Having a piece selected, you can swap it with another one on your tray by clicking on the other piece with the <b>Right Mouse Button</b>.<br>When it's your turn, you can place it on the board by clicking on a tile on the board with the <b>Left Mouse Button</b>.", width: 440 },
    { html: "You can arrange words on the board from left to right or from top to bottom.<br>The first word in the game must be placed on the <b>yellow tile</b> in the middle of the board.<br>Each next word has to contain at least one letter already present on the board.", width: 440, pos: { my: "left center", at: "left center" }, arrow: { pos: ["calc(50vw - 60px)", "calc(50vh - 115px)"], rot: 90 }, },
    { html: "After you've placed your pieces, click the <b>PLACE WORD</b> button to place it. If it's correct, the word will be placed on the board and you will have completed your turn.<br>You will receive points equivalent to the length of the word.", width: 520, arrow: { pos: ["110px", "85px"], rot: 180 } },
    { html: "If you make a mistake, you can retrieve your pieces my clicking the <b>RESET WORD</b> button.", width: 420, arrow: { pos: ["215px", "85px"], rot: 180 } },
    { html: "If you can't think of any word to make, you can choose to redraw some of your pieces using the <b>REDRAW LETTERS</b> button.", width: 440, arrow: { pos: ["110px", "145px"], rot: 180 } },
    { html: "Once you're in <b>redraw mode</b>, select the pieces you want to exchange on your tray.<br>Then you can redraw using the <b>REDRAW!</b> button.<br>This uses up your turn.", width: 440, arrow: { pos: ["215px", "145px"], rot: 180 } },
    { html: "The game ends when both players have <b>redrawn twice in a row</b>.<br>The player with the most points wins.", width: 430 },
    { html: "That is all.<br>You now how to play our game.<br>Have fun!" }
]

var Tutorial = {
    start: function () {
        if (!PageUtils.getCookie("tutorialskipped")) {
            Game.camera.position.set(70, 170, 300)
            Game.camera.rotation.set(-0.64, 0, 0)
            Game.camera.updateProjectionMatrix()

            $("#showUI").click()
            $("#showScr").click()

            this.stage = -1
            this.nextStage()
        }
    },

    nextStage: function () {
        this.stage++
        let stageData = TutorialStages[this.stage]

        if (this.dialog) { this.dialog.remove(); this.dialog = null }
        this.dialog = $("<div>")

        let dialogOptions = {
            modal: true,
            resizable: false,
            draggable: true,
            title: "Tutorial",
            close: function (event, ui) {
                if (Tutorial.arrow) { Tutorial.arrow.remove(); Tutorial.arrow = null }
                $(this).remove()
                Tutorial.dialog = null
                if (Tutorial.stage != TutorialStages.length - 1) Tutorial.nextStage()
            },
        }

        if (stageData.pos) dialogOptions.position = stageData.pos

        if (stageData.arrow) {
            if (Tutorial.arrow) { Tutorial.arrow.remove(); Tutorial.arrow = null }
            Tutorial.arrow = $("<img id='test'>")
            Tutorial.arrow.attr("src", "/gfx/tutorial-arrow.png")
            Tutorial.arrow.addClass("tutorialArrow")
            Tutorial.arrow.css("left", stageData.arrow.pos[0])
            Tutorial.arrow.css("top", stageData.arrow.pos[1])
            Tutorial.arrow.css("transform", `rotate(${stageData.arrow.rot}deg)`)
            $("#game").append(Tutorial.arrow)
        }

        let lastStage = (Tutorial.stage == TutorialStages.length - 1)

        let leftButton = lastStage ? "Close" : "Next"
        let rightButton = lastStage ? "Don't Show Again" : "Skip Tutorial"
        dialogOptions.buttons = {}
        dialogOptions.buttons[leftButton] = function (event, ui) {
            $(this).dialog("close")
        }
        dialogOptions.buttons[rightButton] = function () {
            PageUtils.setCookie("tutorialskipped", true)
            if (Tutorial.arrow) { Tutorial.arrow.remove(); Tutorial.arrow = null }
            $(this).remove()
            Tutorial.dialog = null
        }

        if (stageData.width) dialogOptions.width = stageData.width

        if (lastStage) {
            dialogOptions.width = 360
            dialogOptions.minWidth = 360
        }

        this.dialog.html(stageData.html).dialog(dialogOptions)
    },

    clear: function () {
        if (this.arrow) { this.arrow.remove(); this.arrow = null }
        if (this.dialog) { this.dialog.remove(); this.dialog = null }
    }
}