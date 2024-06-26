const axios = require("axios")
const { createOpenVa, createCloseVa, createDeleteOrInquiryVa, createStatus } = require("../helpers/createVaBody")
const { headersAuthGenerator, headersSymetricGenerator } = require("../helpers/headersGenerator")
const toIsoString = require("../helpers/toIsoString")
const paymentSignatureValidator = require("../helpers/paymentSignatureValidator")
const checkStatusPayment = require("../helpers/checkStatusPayment")

class SnapController{
    static getTokenAuth(req, res){
        const date = new Date()
        const headers = headersAuthGenerator(date)
        const body = {
            "grantType": "client_credentials"
        }
        console.log(headers, body)
        axios.post("https://snapdev.duitku.com/auth/v1.0/access-token/b2b/", body, {headers: headers })
            .then(response => res.json(response.data))
            .catch(err => res.json(err.response.data))
    }

    static CreateVa(req, res) {
        const {
            userId,
            name,
            orderId,
            closeAmount
        } = req.body
        // console.log(userId, name, orderId, "data post")
        const host = "https://snapdev.duitku.com"
        const url = "/merchant/va/v1.0/transfer-va/create-va"
        const date = new Date()
        // const body = createOpenVa("123456789", "testing rayhan", `TestOpenVa${date.getTime()}`, date)
        let body = {}
        if(parseInt(closeAmount) > 0){
            body = createCloseVa(userId, name, orderId, closeAmount, date)
        }else{
            body = createOpenVa(userId, name, orderId, date)
        }
        const headers = headersSymetricGenerator(date, "POST", url, body)
        console.log(headers, body)
        
        axios.post(host + url, body, {headers: headers })
            .then(response => {
                console.log(response.data)
                res.json(response.data)
            })
            .catch(err => {
                console.log(err.response.data)
                res.json(err.response.data)
            })
    }

    static UpdateVa(req, res){
        const {
            userId,
            name,
            orderId,
            closeAmount
        } = req.body
        const host = "https://snapdev.duitku.com"
        const url = "/merchant/va/v1.0/transfer-va/update-va"
        const date = new Date()
        let body = {}
        if(parseInt(closeAmount) > 0){
            body = createCloseVa(userId, name, orderId, closeAmount, date)
        }else{
            body = createOpenVa(userId, name, orderId, date)
        }     
        const headers = headersSymetricGenerator(date, "PUT", url, body)
        console.log(headers, body)  
        
        axios.put(host + url, body, {headers: headers })
            .then(response => {
                console.log(response.data)
                res.json(response.data)
            })
            .catch(err => {
                console.log(err.response.data)
                res.json(err.response.data)
            })
    }

    static DeleteVa(req,res){
        const {
            userId,
            orderId,
        } = req.body
        const host = "https://snapdev.duitku.com"
        const url = "/merchant/va/v1.0/transfer-va/delete-va"
        const date = new Date()
        const body = createDeleteOrInquiryVa(userId, orderId)
        const headers = headersSymetricGenerator(date, "DELETE", url, body)
        console.log(headers, body) 
        
        axios.delete(host + url, {
            headers: headers,
            data: body
        })
        .then(response => {
            console.log(response.data)
            res.json(response.data)
        })
        .catch(err => {
            console.log(err.response.data)
            res.json(err.response.data)
        })
    }

    static InquiryVa(req,res){
        const {
            userId,
            orderId,
        } = req.body
        const host = "https://snapdev.duitku.com"
        const url = "/merchant/va/v1.0/transfer-va/inquiry-va"
        const date = new Date()
        const body = createDeleteOrInquiryVa(userId, orderId)
        const headers = headersSymetricGenerator(date, "POST", url, body)
        console.log(headers, body) 
        
        axios.post(host + url, body, {headers: headers })
        .then(response => {
            console.log(response.data)
            res.json(response.data)
        })
        .catch(err => {
            console.log(err.response.data)
            res.json(err.response.data)
        })
    }

    static InquiryStatus(req,res){
        const {
            userId,
            orderId,
        } = req.body
        const host = "https://snapdev.duitku.com"
        const url = "/merchant/va/v1.0/transfer-va/status"
        const date = new Date()
        const body = createStatus(userId, orderId)
        const headers = headersSymetricGenerator(date, "POST", url, body)
        console.log(headers, body) 
        
        checkStatusPayment({
            body,
            headers
        }, (err, resp) => {
            if(err){
                res.send(err)
            }else{
                res.send(resp)
            }
        })
    }

    static PaymentVa(req, res){
        const body = req.body
        const url = req.url
        const host = "https://snapdev.duitku.com"
        const urlStatus = "/merchant/va/v1.0/transfer-va/status"
        const date = new Date()
        const xExternalId = req.headers["x-external-id"]
        const xPartnerId = req.headers["x-partner-id"]
        const xSignature = req.headers["x-signature"]
        const xTimestamp = req.headers["x-timestamp"]
        const channelId = req.headers["channel-id"]
        let isValid = paymentSignatureValidator(body, xTimestamp, xSignature, url)
        if(isValid){
            console.log(body.customerNo, body.trxId)
            const bodyInquiry = createStatus(body.customerNo, body.trxId)
            const headersInquiry = headersSymetricGenerator(date, "POST", urlStatus, bodyInquiry)
            console.log(headersInquiry, bodyInquiry) 
            checkStatusPayment({
                body: bodyInquiry,
                headers: headersInquiry
            }, (err, resp) => {
                if(err){
                    res.status(400).send(err)
                }else{
                    console.log("Status payment registered")
                    res.send({
                        validated: true,
                        resp
                    })
                }
            })
        }else{
            res.send({
                message: "Received but not validated"
            })
        }
    }
}

module.exports = SnapController