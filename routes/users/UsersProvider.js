const db = require('../../config/firebase')

class UsersProvider {
    constructor() {        
    }

    update(user) {
        return new Promise((resolve, reject) => {
            db.collection('users').doc(user.userId).get().then(prodDoc => {
                if (prodDoc.exists) {
                    db.collection('users').doc(user.userId).update(user).then(() => {
                        const json = {
                            code: 200,
                            status: 'success',
                            message: `successfully updated user ${user.userId}`
                        }
                        resolve(json)                        
                    })
        
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: `[DOCUMENT DOES NOT EXIST]: user with id ${user.userId} does not exist`,
                        error
                    }
                    reject(json)                    
                }
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not update user',
                    error
                }
                reject(json)
            })
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            let users = []
            db.collection('users').get().then((querySnapshot) => {
                querySnapshot.forEach((user) => {
                    users.push(user.data())
                })

                const json = {
                    code: 200,
                    status: 'success',
                    message: 'successfully fetched all users',
                    users: JSON.stringify(users)
                }

                resolve(json)            
            }).catch(error => {

                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not get users',
                    error
                }

                reject(json)                
            })
        })
    }

    get(userId) {
        return new Promise((resolve, reject) => {
            db.collection('users').doc(userId).get().then(document => {
                if (document.exists) {
                    const json = {
                        code: 200,
                        status: 'success',
                        message: `successfully fetched user ${userId}`,
                        user: JSON.stringify(document.data())
                    }

                    resolve(json)                    
                } else {
                    const json = {
                        code: 500,
                        status: 'failure',
                        message: 'user does not exist',
                        error: `[DOCUMENT DOES NOT EXIST]: user with id ${userId} does not exist`
                    }

                    reject(json)                    
                }    
            }).catch(error => {
                const json = {
                    code: 500,
                    status: 'failure',
                    message: 'could not get user',
                    error
                }

                reject(json)
            })
        })
    }

    
}

module.exports = {
    UsersProvider
}
