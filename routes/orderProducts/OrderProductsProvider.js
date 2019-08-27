const db = require('../../config/firebase')
/**
 * To create actual products that can be inside an order, i.e. hamburguer, french fries, salad, etc.
 */
class OrderProductsProvider {
    constructor() {
        this.db = db
    }

    /**
     * Receive an object with product name, retail price and an array of ingredients ID's
     * @param {Stringified Object} orderProduct 
     */
    create(orderProduct) {
        return new Promise((resolve, reject) => {            
            this.db.collection('orderProducts').add(orderProduct).then(document => {
                // set auto-generated id
                document.update({
                    id: document.id
                }).then(() => {
                    const json = {
                        code: 200,
                        status: 'success',
                        message: 'successfully created order product',
                        orderProductId: document.id                        
                    }

                    resolve(json)
                })
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not create order product',
                    error
                }
                reject(json)
            })
        })
    }    

    update(orderProduct) {
        return new Promise((resolve, reject) => {
            this.db.collection('orderProducts').doc(orderProduct.id).get().then(prodDoc => {
                if (prodDoc.exists) {
                    db.collection('orderProducts').doc(orderProduct.id).update(orderProduct).then(() => {
                        const json = {
                            code: 200,
                            status: 'success',
                            message: `successfully updated product ${orderProduct.id}`
                        }
                        resolve(json)
                    })
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: `[DOCUMENT DOES NOT EXIST]: user with id ${orderProduct.id} does not exist`,
                        error
                    }
                    reject(json)
                }
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not update orderProduct',
                    error
                }
                reject(json)
            })
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            let products = []
            this.db.collection('orderProducts').get().then((querySnapshot) => {
                querySnapshot.forEach((product) => {
                    products.push(product.data())
                })

                const json = {
                    code: 200,
                    status: 'success',
                    message: 'successfully fetched all orderProducts',
                    products: JSON.stringify(products)
                }
                
                resolve(json)
            }).catch(error => {

                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not get orderProducts',
                    error
                }
                reject(json)
            })
        })
    }

    get(productId) {
        return new Promise((resolve, reject) => {
            this.db.collection('orderProducts').doc(productId).get().then(document => {
                if (document.exists) {
                    const json = {
                        code: 200,
                        status: 'success',
                        message: `successfully fetched order product ${productId}`,
                        product: JSON.stringify(document.data())
                    }
                    resolve(json)
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: 'product does not exist',
                        error: `[DOCUMENT DOES NOT EXIST]: order product with id ${productId} does not exist`
                    }
                    reject(json)
                }    
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not get product',
                    error
                }
                reject(json)
            })
        })
    }

    delete(productId) {
        return new Promise((resolve, reject) => {
            this.db.collection('orderProducts').doc(productId).delete().then(() => {
                const json = {
                    code: 200,
                    status: 'success',
                    message: `successfully deleted order product ${productId}`            
                }
                resolve(json)
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: `could not delete order product ${productId}`,
                    error
                }
                reject(json)
            })
        })
    }
}

module.exports = {
    OrderProductsProvider
}
