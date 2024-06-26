const rs = require('jsrsasign')
const rsu = require('jsrsasign-util');
const toIsoString = require('./toIsoString');
const CryptoJS = require('crypto-js')

function paymentSignatureValidator(body, date, signature, url){
    let minifyBody = JSON.stringify(body)
    let encBody = CryptoJS.SHA256(minifyBody).toString()
    let stringToSign = `POST:${url}:${encBody.toLowerCase()}:${date}`
    let publicKey = rs.KEYUTIL.getKey(rsu.readFile("./duitkukey/duitku_publickey.pem"))
    let sign = new rs.KJUR.crypto.Signature({"alg": "SHA256withRSA"})
    sign.init(publicKey)
    sign.updateString(stringToSign)
    // sign.updateString(stringToSign2)
    const isSignatureValid = sign.verify(CryptoJS.enc.Hex.stringify(CryptoJS.enc.Base64.parse(signature)))
    console.log("minifyBody", minifyBody)
    console.log("encBody", encBody)
    console.log("isSignatureValid", isSignatureValid)
    return isSignatureValid
}

module.exports = paymentSignatureValidator