var amqp = require('amqplib/callback_api');
const db = require('../config/firebase')
var producer = require('../rabbit/producer');
var myProducer = new producer('amqp://localhost')

module.exports = function(path) {
    this.listenForMessages = async function() {
        amqp.connect(path, (err, conn) => {
            if (err) {
                console.log("RabbitMq service is offline")
                return
            }
            console.log('listening to new messages...')
            conn.createChannel((err, ch) => {
                console.log('created channel')
                if (err) {
                    throw err
                }
                
                ch.assertQueue('ordenes')

                ch.consume('ordenes', function(message) {
                    console.log(`message received: ${message.content.toString()}`)
                    var name = JSON.parse(message.content.toString()).item
                    console.log(name)
                    db.collection('orderProducts').where("name", "==", name).get().then(function(querySnapshot) {
                        querySnapshot.forEach(function (pd) {
                            if (pd.exists) {
                                const product = pd.data()
                                const ingredientsArray = product.ingredientsArray           
                                ingredientsArray.forEach((ingredient, index, array) => {                    
                                    db.collection('products').doc(ingredient.id).get().then(prodDoc => {
                                        if (prodDoc.exists) {
                                            let newStock = null
                                            newStock = prodDoc.data().stock - (ingredient.qty * product.quantity) >= 0 ? 
                                                        prodDoc.data().stock - (ingredient.qty * product.quantity) : null
                            
                                            if (newStock != null) {
                                                myProducer.notify_on_stock(product.id)     
                                            } else {
                                                // cant process order, not enough stock    
                                                console.log(`Not enough ${prodDoc.data().name} required for ${product.name}`)                            
                                                errorIs = `Not enough ${prodDoc.data().name} required for ${product.name}`
                                                myProducer.notify_out_of_stock(product.id, prodDoc.data().name)
                                            }                            
                                        }                       
                                    })                    
                                })
                            }
                        })
                        
                    })
                }, {noAck: true})
            })
        })
    }
}