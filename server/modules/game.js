class ScrabbleGame {
    constructor() {
        this.playerAScore = 0
        this.playerBScore = 0
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
}

module.exports = { //GameManager
    Game: ScrabbleGame
}