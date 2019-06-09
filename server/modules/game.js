class ScrabbleGame {
    constructor() {
        this.playerAScore = 0
        this.playerBScore = 0
        this.board = []
        this.nicknameA = ""
        this.nicknameB = ""
        this.turnA = true
        this.playerASkipped = 0
        this.playerBSkipped = 0
    }

    setScoreA(score) {
        this.playerAScore = score
    }

    setScoreB(score) {
        this.playerBScore = score
    }

    getScores() {
        return { a: this.playerAScore, b: this.playerBScore }
    }

    setBoard(b) {
        this.board = b
    }

    getBoard() {
        return this.board
    }

    setNicknameA(nickname) {
        this.nicknameA = nickname
    }

    setNicknameB(nickname) {
        this.nicknameB = nickname
    }

    getNicknames() {
        return { a: this.nicknameA, b: this.nicknameB }
    }

    playerATurn() {
        return this.turnA
    }

    playerBTurn() {
        return !this.turnA
    }

    nextTurn() {
        this.turnA = !this.turnA
    }

    setTurnA() {
        this.turnA = true
    }

    setTurnB() {
        this.turnA = false
    }
}

module.exports = { //GameManager
    Game: ScrabbleGame
}