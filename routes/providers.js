var express = require('express')
var router = express.Router()

const { ProvidersProvider } = require('./providers/ProvidersProvider')
const providersProvider = new ProvidersProvider()

router.get('/low-stock-products', (req, res, next) => {   
    providersProvider.getLowStockProducts().then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })

})

module.exports = router;
