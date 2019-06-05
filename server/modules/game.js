class ScrabbleGame {
    constructor() {
        this.playerAScore = 0
        this.playerBScore = 0
        this.board = []
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
}

module.exports = { //GameManager
    Game: ScrabbleGame
}