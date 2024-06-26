const config = require("../config")
const toIsoString = require("./toIsoString")

function createCloseVa(customerNo, virtualAccountName, trxId, totalAmount, expiredDate){
    let date = new Date()
    date.setDate(expiredDate.getDate() + 1)
    // date.setMinutes(expiredDate.getMinutes() + 5)
    let body = {
        partnerServiceId: config.partnerServiceId,
        customerNo,
        virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
        virtualAccountName,
        trxId,
        totalAmount: {
            "value": `${totalAmount}.00`,
            "currency": "IDR"
        },
        virtualAccountTrxType: "1",
        expiredDate: toIsoString(date),
        additionalInfo: {
            "minAmount": "0.00",
            "maxAmount": "0.00"
        }
    }
    return body
}

function createOpenVa(customerNo, virtualAccountName, trxId, expiredDate){
    let date = new Date()
    date.setDate(expiredDate.getDate() + 1)
    let body = {
        partnerServiceId: config.partnerServiceId,
        customerNo,
        virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
        virtualAccountName,
        trxId,
        totalAmount: {
            "value": "0.00",
            "currency": "IDR"
        },
        virtualAccountTrxType: "2",
        expiredDate: toIsoString(date),
        additionalInfo: {
            "minAmount": "10000.00",
            "maxAmount": "50000000.00"
        }
    }
    return body
}

function createDeleteOrInquiryVa(customerNo, trxId){
    let body = {
        partnerServiceId: config.partnerServiceId,
        customerNo,
        virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
        trxId,
    }    
    return body
}

function createStatus(customerNo, trxId){
    let body = {
        partnerServiceId: config.partnerServiceId,
        customerNo,
        virtualAccountNo: `${config.partnerServiceId}${customerNo}`,
        inquiryRequestId: trxId,
    }    
    return body
}

module.exports = {
    createCloseVa,
    createOpenVa,
    createDeleteOrInquiryVa,
    createStatus
}