const db = require('../../config/firebase')
class ProvidersProvider {
    constructor() {
        this.db = db
    }

    getLowStockProducts() {
        return new Promise((resolve, reject) => {
            let products = []
            db.collection('products').where('stock', '<=', 10).get().then((querySnapshot) => {
                querySnapshot.forEach((product) => {
                    products.push(product.data())
                })

                const json = {
                    code: 200,
                    status: 'success',
                    message: 'successfully fetched all low stock products',
                    products: JSON.stringify(products)
                }

                resolve(json)
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not fetch all low stock products',
                    error
                }
                
                reject(json)
            })
        })
    }
}

module.exports = {
    ProvidersProvider
}
