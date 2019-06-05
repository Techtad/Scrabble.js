var DataStore = require("nedb")

var letters = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
]
var LetterDBs = []
for (let l of letters) LetterDBs[l] = new DataStore({ filename: `./server/db/english/${l}.db`, autoload: true })

module.exports = { //DatabaseHandler
    isWord: async function (string) {
        return await new Promise(function (resolve, reject) {
            if (!string || !string.length || string.length <= 0)
                resolve(false)

            string = string.toLowerCase()

            let firstLetter = string[0]
            if (!firstLetter || !firstLetter.length || firstLetter.length != 1 || !letters.includes(firstLetter)) resolve(false)

            LetterDBs[firstLetter].find({ word: string }, function (err, docs) {
                if (err) resolve(false)
                resolve(docs.length > 0)
            })
        })
    }
}