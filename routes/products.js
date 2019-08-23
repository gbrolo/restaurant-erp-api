var express = require('express')
var router = express.Router()
var producer = require('../rabbit/producer');
var myProducer = new producer('amqp://localhost')

const db = require('../config/firebase')

router.post('/create', (req, res, next) => {
    const product = JSON.parse(req.body.product)

    db.collection('products').add(product).then(document => {
        document.update({
            id: document.id
        }).then(() => {
            res.json({
                code: 200,
                status: 'success',
                message: 'successfully created product',
                productId: document.id
            })
            myProducer.notify_product_created(product)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not create product',
            error
        })
    })

})
router.post('/update', (req, res, next) => {    
    const user = JSON.parse(req.body.product) 
    console.log(user)
    db.collection('products').doc(user.id).get().then(prodDoc => {
        if (prodDoc.exists) {
            db.collection('products').doc(user.id).update(user).then(() => {
                //myProducer.notify_product_created(user)
            })

            res.json({
                code: 200,
                status: 'success',
                message: `successfully updated product ${user.id}`
            })
        } else {
            res.json({
                code: 500,
                status: 'failure',
                message: `[DOCUMENT DOES NOT EXIST]: user with id ${user.id} does not exist`,
                error
            })
        }
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not update product',
            error
        })
    })

})

router.get('/getall', (req, res, next) => {
    let products = []
    db.collection('products').get().then((querySnapshot) => {
        querySnapshot.forEach((product) => {
            products.push(product.data())
        })
        
        res.json({
            code: 200,
            status: 'success',
            message: 'successfully fetched all products',
            products: JSON.stringify(products)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get products',
            error
        })
    })
})

router.get('/get', (req, res, next) => {    
    const productId = req.body.id    
    db.collection('products').doc(productId).get().then(document => {
        if (document.exists) {
            res.json({
                code: 200,
                status: 'success',
                message: `successfully fetched product ${productId}`,
                product: JSON.stringify(document.data())
            })
        } else {
            res.json({
                code: 500,
                status: 'failure',
                message: 'product does not exist',
                error: `[DOCUMENT DOES NOT EXIST]: product with id ${productId} does not exist`
            })
        }    
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get product',
            error
        })
    })
})

router.post('/delete', (req, res, next) => {
    const productId = req.body.id    
    db.collection('products').doc(productId).delete().then(() => {
        res.json({
            code: 200,
            status: 'success',
            message: `successfully deleted product ${productId}`            
        })
        myProducer.notify_product_deleted(productId)
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: `could not delete product ${productId}`,
            error
        })
    })
})

module.exports = router;
