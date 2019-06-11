var TutorialStages = [
    { html: "Welcome to Scrabble!<br>This quick tutorial will teach you how to play" },
    { html: "Stage 2" },
    { html: "Stage 3<br><br><br>" },
    { html: "<br><br>Stage 4" },
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

        this.dialog.html(stageData.html).dialog({
            modal: true,
            resizable: false,
            draggable: false,
            title: "Tutorial",
            close: function (event, ui) {
                if (Tutorial.stage != TutorialStages.length - 1) Tutorial.nextStage()
                $(this).remove()
            },
            buttons: {
                Next: function (event, ui) {
                    $(this).dialog("close")
                },
                "Skip Tutorial": function () {
                    PageUtils.setCookie("tutorialskipped", true)
                    $(this).remove()
                }
            }
        })
    },

    clear: function () {
        if (this.dialog) this.dialog.remove()
    }
}