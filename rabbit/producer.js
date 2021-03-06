var amqp = require('amqplib/callback_api');

module.exports = function(path) {
    this.notify_product_created = async function(product, productId) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var message = { 
                    id: productId,
                    name: product.name,
                    retailPrice: product.retailPrice
                }
                var queue = "new_product_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_product_updated = async function(product) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }

                var queue = "updated_product_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(product)))
                console.log(`Message sent: ${product}`)
            })
        })
    }

    this.notify_product_deleted = async function(productId) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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

    this.notify_stock_change = async function(productId, newStock) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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

    this.notify_out_of_stock = async function(productId, ingredientName) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var message = { productId: productId, ingredientMissing: ingredientName }
                var queue = "out_of_stock_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_on_stock = async function(productId) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
            conn.createChannel((err, ch) => {
                if (err) {
                    throw err
                }
                var message = {productId: productId}
                var queue = "on_stock_queue"
                ch.assertQueue(queue)
                ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)))
                console.log(`Message sent: ${message}`)
            })
        })
    }

    this.notify_new_receipt = async function(receipt) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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

    this.notify_deleted_receipt = async function(receiptId) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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

    this.notify_new_user = async function(user) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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

    this.notify_update_user = async function(user) {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
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