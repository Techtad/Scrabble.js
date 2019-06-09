var PageUtils = {
    getURLParam: function (name) {
        let pairs = window.location.search.substr(1).split('&')
        let urlParams = []
        for (let pair of pairs) {
            let values = pair.split("=")
            urlParams[values[0]] = values[1]
        }

        return urlParams[name]
    },

    redirect: function (url) {
        window.location = url
    },

    setCookie: function (name, value) {
        let date = new Date()
        date.setTime(date.getTime() + 172800000)
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`
    },

    getCookie: function (cookieName) {
        let decodedCookie = decodeURI(document.cookie)
        let entries = decodedCookie.split("; ")
        for (let entry of entries) {
            let pair = entry.split("=")
            let name = pair[0]
            let value = pair[1]
            if (name == cookieName)
                return value
        }
        return null
    }
}