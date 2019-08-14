var express = require('express')
var router = express.Router()

const db = require('../config/firebase')

router.get('/low-stock-products', (req, res, next) => {    
    let products = []
    db.collection('products').where('stock', '<=', 10).get().then((querySnapshot) => {
        querySnapshot.forEach((product) => {
            products.push(product.data())
        })

        res.json({
            code: 200,
            status: 'success',
            message: 'successfully fetched all low stock products',
            products: JSON.stringify(products)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not fetch all low stock products',
            error
        })
    })

})

module.exports = router;
