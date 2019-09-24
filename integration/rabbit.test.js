var producer = require('../rabbit/producer')
var myProducer = new producer('amqp://localhost')
var amqp = require('amqplib/callback_api');
var assert = require('assert')

describe('deleted products', function() {
    beforeEach(async function() {
        await myProducer.notify_product_deleted('Aj3JK29aj3a04')
    })
    it('should have pushed deleted product message to queue', async function() {
        amqp.connect('amqp://localhost', (err, conn) => {
            console.log('listening to new messages...')
            conn.createChannel((err, ch) => {
                console.log('created channel')
                if (err) {
                    throw err
                }
                
                ch.assertQueue('delete_product_queue')
                ch.consume('delete_product_queue', function(message) {
                    console.log(`message received: ${message.content.toString()}`)
                    var id = JSON.parse(message.content.toString()).id
                    console.log(id)
                    return assert.equal(id, 'Aj3JK29aj3a04')
                })
            }, {noAck: true})
        })
    })

})