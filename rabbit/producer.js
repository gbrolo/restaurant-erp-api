var amqp = require('amqplib/callback_api');

module.exports = function(path) {
    this.notify_product_created = function(product) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }

                var queue = "new_product_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(product)))
                console.log(`Message sent: ${product}`)
            })
        })
    }

    this.notify_product_deleted = function(productId) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var message = { id: productId }
                var queue = "delete_product_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_stock_change = function(productId, newStock) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }

                var message = { id: productId, stock: newStock }
                var queue = "update_stock_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_new_receipt = function(receipt) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var queue = "new_receipt_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(receipt)))
                console.log(`Message sent: ${receipt}`)
            })
        })
    }

    this.notify_deleted_receipt = function(receiptId) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var queue = "deleted_receipt_queue"
                var message = {id: receiptId}
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_new_user = function(user) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var queue = "new_user_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(user)))
                console.log(`Message sent: ${user}`)
            })
        })
    }

    this.notify_update_user = function(user) {
        amqp.connect(path, (err, conn) => {
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var queue = "update_user_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(user)))
                console.log(`Message sent: ${user}`)
            })
        })
    }

    
}