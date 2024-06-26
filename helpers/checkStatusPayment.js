const axios = require("axios")

function checkStatusPayment({
    body,
    headers,
    host = "https://snapdev.duitku.com",
    url = "/merchant/va/v1.0/transfer-va/status"
}, cb) {
    axios.post(host + url, body, {headers: headers })
    .then(response => {
        console.log(response.data)
        cb(null, response.data)
    })
    .catch(err => {
        console.log(err.response.data)
        cb(err.response.data, {})
    })
}

module.exports = checkStatusPayment