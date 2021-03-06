var express = require('express')
var router = express.Router()
var producer = require('../rabbit/producer');
var myProducer = new producer('amqp://localhost')

const { ProductsProvider } = require('./products/ProductsProvider')
const productsProvider = new ProductsProvider()

router.post('/create', (req, res, next) => {
    const product = JSON.parse(req.body.product)    
    
    productsProvider.create(product).then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })

})
router.post('/update', (req, res, next) => {    
    const product = JSON.parse(req.body.product) 
    console.log(product)

    productsProvider.update(product).then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })

})

router.get('/getall', (req, res, next) => {

    productsProvider.getAll().then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })
})

router.get('/get', (req, res, next) => {    
    const productId = req.body.id    

    productsProvider.get(productId).then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })

})

router.post('/delete', (req, res, next) => {
    const productId = req.body.id  
    
    console.log(productId)

    productsProvider.delete(productId).then(json => {
        res.json(json)
    }).catch(json => {
        res.json(json)
    })

})

module.exports = router;
