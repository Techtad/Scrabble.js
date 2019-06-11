var inLobby

var Lobby = {
    init: function () {
        $("#lobby").on("load", function (event) {
            inLobby = $("#lobby").contents()
            Lobby.load()
        })
    },

    getElem: function (id) {
        return $(`#${id}`, inLobby)
    },

    load: function () {
        Lobby.client = SocketHander.client

        //Event listeners
        Lobby.getElem("nicknameInput").on("keydown", function (event) {
            if (event.key == "Enter") {
                event.preventDefault()
                Lobby.sendNickname(Lobby.getElem("nicknameInput").val())
            }
        })
        Lobby.getElem("sendButton").on("click", function (event) { Lobby.sendNickname(Lobby.getElem("nicknameInput").val()) })

        //Socket.io responses
        Lobby.client.on("send-nickname-resp", function (data) {
            console.log("Event socketowy: ", "send-nickname", data)
            if (!data.accepted) {
                Lobby.getElem("nicknameMessage").text(data.reason)
            } else {
                Lobby.getElem("nicknameForm").css("display", "none")
                Lobby.getElem("yourName").text(Lobby.myName)
                Lobby.getElem("playerListContainer").css("display", "block")
            }
        })
        Lobby.client.on("lobby-update-resp", function (data) {
            console.log("Event socketowy: ", "lobby-update", data)
            Lobby.getElem("playerList").empty()
            for (let info of data.players) {
                let name = info.nickname
                let status = info.status

                if (name == Lobby.myName) continue

                let entry = $("<div>")
                entry.addClass("listEntry")

                let nicknameCell = $("<div>")
                nicknameCell.addClass("left")
                nicknameCell.text(name)
                entry.append(nicknameCell)

                let statusCell = $("<div>")
                statusCell.addClass("right")
                if (status == "available") {
                    let inviteBtn = $("<input type='button'>")
                    inviteBtn.val("Invite")
                    inviteBtn.attr("nickname", name)
                    inviteBtn.on("click", function (event) {
                        Lobby.client.emit("invite-player", { nickname: $(this).attr("nickname") })
                    })
                    statusCell.append(inviteBtn)
                } else statusCell.text(status)
                entry.append(statusCell)

                Lobby.getElem("playerList").append(entry)
            }
        })
        Lobby.client.on("invite-player-resp", function (data) {
            console.log("Event socketowy: ", "invite-player", data)
            if (data.success) {
                Lobby.waitDialog = $("<div>")
                Lobby.waitDialog.text("Waiting for response...").dialog({
                    title: "Invitation Sent",
                    modal: true,
                    close: function (event, ui) {
                        Lobby.client.emit("cancel-invitation")
                        $(this).remove()
                    },
                    buttons: {
                        "Cancel": function (event, ui) {
                            $(this).dialog("close")
                        },
                    }
                })
            } else {
                $("<div>").text(data.reason).dialog({
                    title: "Failed to invite player",
                    modal: true,
                    close: function (event, ui) { $(this).remove() },
                })
            }
        })
        Lobby.client.on("invitation-resp", function (data) {
            console.log("Event socketowy: ", "invitation", data)
            $("<div>").text(`You have been invitated to a game by ${data.nickname}.`).dialog({
                title: "Invitation",
                modal: true,
                close: function (event, ui) {
                    Lobby.client.emit("invitation-reply", { nickname: data.nickname, agreed: false })
                    $(this).remove()
                },
                buttons: {
                    Accept: function (event, ui) {
                        Lobby.client.emit("invitation-reply", { nickname: data.nickname, agreed: true })
                        $(this).remove()
                    },
                    Reject: function (event, ui) {
                        Lobby.client.emit("invitation-reply", { nickname: data.nickname, agreed: false })
                        $(this).remove()
                    }
                }
            })
        })
        Lobby.client.on("invitation-reply-resp", function (data) {
            $("<div>").text(data.reason).dialog({
                title: "Invitation Invalid",
                modal: true,
                close: function (event, ui) { $(this).remove() },
            })
        })
        Lobby.client.on("invitaion-rejected-resp", function (data) {
            console.log("Event socketowy: ", "invitaion-rejected", data)
            $("<div>").text("Your invitation has been rejected").dialog({
                title: "Invitation Response",
                modal: true,
                close: function (event, ui) { $(this).remove() },
            })
            if (Lobby.waitDialog) Lobby.waitDialog.remove()
        })
        Lobby.client.on("session-ready-resp", function (data) {
            console.log("Event socketowy: ", "session-ready", data)
            if (Lobby.waitDialog) Lobby.waitDialog.remove()
            //Game.reset()
            Lobby.client.emit("player-ready")
        })
    },

    sendNickname: function (nickname) {
        Lobby.getElem("nicknameInput").val("")
        if (nickname != "") {
            Lobby.myName = nickname
            Lobby.client.emit("send-nickname", { nickname: nickname })
        }
        else Lobby.getElem("nicknameMessage").text("Nickname cannot be empty")
    },

    hide: function () {
        $("#lobby").css("display", "none")
        $("#game").css("display", "block")
    },

    reveal: function () {
        $("#lobby").css("display", "block")
        $("#game").css("display", "none")
    }
}