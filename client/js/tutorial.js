var TutorialStages = [
    { html: "Welcome to Scrabble!<br>This quick tutorial will teach you how to play" },
    { html: "Stage 2" },
    { html: "Stage 3<br><br><br>" },
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

        if (this.dialog) this.dialog.remove()
        this.dialog = $("<div>")

        let dialogOptions = {
            modal: true,
            resizable: false,
            draggable: false,
            title: "Tutorial",
            close: function (event, ui) {
                if (Tutorial.stage != TutorialStages.length - 1) Tutorial.nextStage()
                $(this).remove()
            },
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
            $(this).remove()
        }

        if (lastStage) {
            dialogOptions.width = 360
            dialogOptions.minWidth = 360
        }

        this.dialog.html(stageData.html).dialog(dialogOptions)
    },

    clear: function () {
        if (this.dialog) this.dialog.remove()
    }
}