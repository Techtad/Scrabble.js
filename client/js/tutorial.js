var TutorialStages = [
    { html: "Welcome to Scrabble!<br>This short tutorial will teach you how to play." },
    { html: "Stage 2", pos: [100, 300] },
    { html: "Stage 3<br><br><br>", arrow: { pos: [50, 50], rot: -45 } },
    { html: "<br><br>Stage 4" },
    { html: "And that's all.<br>You now know how to play our game. We hope you enjoy it.<br>Good luck!" }
]

var Tutorial = {
    start: function () {
        if (!PageUtils.getCookie("tutorialskipped")) {
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
            draggable: false,
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
            Tutorial.arrow.css("left", `${stageData.arrow.pos[0]}px`)
            Tutorial.arrow.css("top", `${stageData.arrow.pos[1]}px`)
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