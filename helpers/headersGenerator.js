const config = require("../config")
const toIsoString = require("./toIsoString")
const rs = require('jsrsasign')
const rsu = require('jsrsasign-util')
const CryptoJS = require('crypto-js')

function headersSymetricGenerator(date, method, endpoint, body){
    let minifyBody = JSON.stringify(body)
    let encBody = CryptoJS.SHA256(minifyBody).toString()
    let stringToSign = `${method}:${endpoint}:${config.accessToken}:${encBody.toLowerCase()}:${toIsoString(date)}`
    let signature = CryptoJS.HmacSHA512(stringToSign, config.clientSecret).toString(CryptoJS.enc.Base64)
    let headers = {
        "X-TIMESTAMP": toIsoString(date),
        "X-SIGNATURE": signature,
        "X-PARTNER-ID": config.partnerId,
        "X-EXTERNAL-ID": "9377042667153187000",//Math.floor(1000000000000000000 + Math.random() * 9000000000000000000).toString(),
        "channel-id": config.channelId,
        Authorization: `bearer ${config.accessToken}`
    }
    console.log("minifyBody : ", minifyBody)
    console.log("encBody : ", encBody)
    console.log("stringToSign : ", stringToSign)
    return headers
}

function headersAuthGenerator(date){
    let stringToSign = `${config.partnerId}|${toIsoString(date)}`
    let privateKey = rs.KEYUTIL.getKey(rsu.readFile("./mykey/privatekey.pem"))
    let sign = new rs.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sign.init(privateKey)
    let hash = sign.signString(stringToSign)
    const signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(hash))
    let headers = {
        "X-TIMESTAMP": toIsoString(date),
        "X-SIGNATURE": signature,
        "X-CLIENT-KEY": config.partnerId
    }
    return headers
}

module.exports = {
    headersAuthGenerator,
    headersSymetricGenerator
}