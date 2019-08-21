var express = require('express')
var router = express.Router()
var producer = require('../rabbit/producer');
var myProducer = new producer('amqp://localhost')

const db = require('../config/firebase')

router.post('/generate', (req, res, next) => {
    const name = req.body.name
    const nit = req.body.nit
    const address = req.body.address || 'Guatemala'
    const products = JSON.parse(req.body.products)
    const receiptItems = JSON.parse(req.body.receiptItems)
    let total = 0.0

    products.forEach(product => {
        db.collection('products').doc(product.id).get().then(prodDoc => {
            if (prodDoc.exists) {
                let newStock = null
                newStock = prodDoc.data().stock - product.quantity >= 0 ? 
                            prodDoc.data().stock - product.quantity : null

                if (newStock != null) {
                    db.collection('products').doc(product.id).update({ stock: newStock }).then(() => {
                        myProducer.notify_stock_change(product.id, newStock)
                    })
                }
            }
        })
    });
    
    receiptItems.forEach(item => {
        total += (parseFloat(item.price) * parseInt(item.quantity))
    });
    
    let receipt = {
        name,
        nit,
        address,
        products,
        receiptItems,
        total,
        date_created: new Date()
    }

    db.collection('receipts').add(receipt).then(document => {
        document.update({
            id: document.id
        }).then(() => {
            receipt.id = document.id
            res.json({
                code: 200,
                status: 'success',
                message: 'successfully created receipt',
                receipt: receipt
            })
            myProducer.notify_new_receipt(receipt)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not create receipt',
            error
        })
    })

})

router.get('/getall', (req, res, next) => {
    let receipts = []
    db.collection('receipts').orderBy('date_created', 'desc').get().then((querySnapshot) => {
        querySnapshot.forEach((receipt) => {
            receipts.push(receipt.data())
        })
        
        res.json({
            code: 200,
            status: 'success',
            message: 'successfully fetched all receipts',
            receipts: JSON.stringify(receipts)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get receipts',
            error
        })
    })
})

router.get('/get', (req, res, next) => {    
    const receiptId = req.body.id    
    db.collection('receipts').doc(receiptId).get().then(document => {
        if (document.exists) {
            res.json({
                code: 200,
                status: 'success',
                message: `successfully fetched receipt ${receiptId}`,
                receipt: JSON.stringify(document.data())
            })
        } else {
            res.json({
                code: 500,
                status: 'failure',
                message: 'receipt does not exist',
                error: `[DOCUMENT DOES NOT EXIST]: receipt with id ${receiptId} does not exist`
            })
        }    
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get receipts',
            error
        })
    })
})

router.post('/delete', (req, res, next) => {
    const receiptId = req.body.id    
    db.collection('receipts').doc(receiptId).delete().then(() => {
        res.json({
            code: 200,
            status: 'success',
            message: `successfully deleted receipt ${receiptId}`            
        })
        myProducer.notify_deleted_receipt(receiptId)
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: `could not delete receipt ${receiptId}`,
            error
        })
    })
})

module.exports = router;
