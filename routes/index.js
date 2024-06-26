const bodyParser = require('body-parser');
const SnapController = require('../controllers/SnapController');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello World!')
  })

router.post('/create-va', bodyParser.json() , SnapController.CreateVa)
router.put('/update-va', bodyParser.json() , SnapController.UpdateVa)
router.post('/inquiry-va', bodyParser.json() , SnapController.InquiryVa)
router.post('/status', bodyParser.json() , SnapController.InquiryStatus)
router.delete('/delete-va', bodyParser.json() , SnapController.DeleteVa)
router.post('/callback/v1.0/transfer-va/payment', bodyParser.json() , SnapController.PaymentVa)
router.post('/get-token-auth', bodyParser.json() , SnapController.getTokenAuth)

module.exports = router