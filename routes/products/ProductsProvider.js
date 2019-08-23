const db = require('../../config/firebase')
class ProductsProvider {
    constructor() {
        this.db = db
    }

    create(product) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').add(product).then(document => {
                document.update({
                    id: document.id
                }).then(() => {
                    const json = {
                        code: 200,
                        status: 'success',
                        message: 'successfully created product',
                        productId: document.id
                    }

                    resolve(json)
                })
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not create product',
                    error
                }
                reject(json)
            })
        })
    }

    update(user) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').doc(user.id).get().then(prodDoc => {
                if (prodDoc.exists) {
                    db.collection('products').doc(user.id).update(user).then(() => {
                        const json = {
                            code: 200,
                            status: 'success',
                            message: `successfully updated product ${user.id}`
                        }
                        resolve(json)
                    })
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: `[DOCUMENT DOES NOT EXIST]: user with id ${user.id} does not exist`,
                        error
                    }
                    reject(json)
                }
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not update product',
                    error
                }
                reject(json)
            })
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            let products = []
            this.db.collection('products').get().then((querySnapshot) => {
                querySnapshot.forEach((product) => {
                    products.push(product.data())
                })

                const json = {
                    code: 200,
                    status: 'success',
                    message: 'successfully fetched all products',
                    products: JSON.stringify(products)
                }
                
                resolve(json)
            }).catch(error => {

                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not get products',
                    error
                }
                reject(json)
            })
        })
    }

    get(productId) {
        return new Promise((resolve, reject) => {
            this.db.collection('products').doc(productId).get().then(document => {
                if (document.exists) {
                    const json = {
                        code: 200,
                        status: 'success',
                        message: `successfully fetched product ${productId}`,
                        product: JSON.stringify(document.data())
                    }
                    resolve(json)
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: 'product does not exist',
                        error: `[DOCUMENT DOES NOT EXIST]: product with id ${productId} does not exist`
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
            this.db.collection('products').doc(productId).delete().then(() => {
                const json = {
                    code: 200,
                    status: 'success',
                    message: `successfully deleted product ${productId}`            
                }
                resolve(json)
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: `could not delete product ${productId}`,
                    error
                }
                reject(json)
            })
        })
    }
}

module.exports = {
    ProductsProvider
}
