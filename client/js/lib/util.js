var PageUtils = {
    getURLParam: function (name) {
        let pairs = window.location.search.substr(1).split('&')
        let urlParams = []
        for (let pair of pairs) {
            let values = pair.split("=")
            urlParams[values[0]] = values[1]
        }

        return urlParams[name]
    }
}