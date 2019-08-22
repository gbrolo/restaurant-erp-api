var express = require('express')
var router = express.Router()
var producer = require('../rabbit/producer');
var myProducer = new producer('amqp://localhost')

const firebase = require('../config/firebaseInit')
const db = require('../config/firebase')
const auth = require('../config/auth')

var serviceAccount = require('../auth/adminsdk-key.json')

var admin = require('firebase-admin')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://restaurant-erp-uvg.firebaseio.com"
})

router.post('/login', (req, res) => {
    auth.setPersistence(firebase.auth.Auth.Persistence.NONE)

    const email = req.body.email
    const password = req.body.password

    auth.signInWithEmailAndPassword(email, password).then(user => {
        return user.user.getIdToken().then(idToken => {
            const expiresIn = 60 * 60 * 24 * 1 * 1000

            admin.auth().createSessionCookie(idToken, {expiresIn}).then((sessionCookie) => {                
                const options = {maxAge: expiresIn, httpOnly: true, secure: true}
                res.cookie('session', sessionCookie, options)
                res.end(JSON.stringify({status: 'success'}))
            }).catch(error => {                
                res.status(401).send('UNAUTHORIZED REQUEST!')
            })
        })
    }).then(() => {
        return auth.signOut()
    })
})

router.post('/logout', (req, res) => {
    res.clearCookie('session')
    res.json({
        code: 200,
        status: 'success',
        message: 'successfully logged out user'
    })
})

router.post('/create', (req, res, next) => {    
    const email = req.body.email
    const password = req.body.password
    const name = req.body.name
    const userPermissions = JSON.parse(req.body.userPermissions)

    auth.createUserWithEmailAndPassword(email, password).then(authenticatedUser => {
        const userToBeCreated = {
            userId: authenticatedUser.user.uid,
            userName: name,
            userEmail: email,
            userPermissions: userPermissions
        }

        db.collection('users').doc(userToBeCreated.userId).set(userToBeCreated).then(() => {
            myProducer.notify_new_user(userToBeCreated)
        })

        res.json({
            code: 200,
            status: 'success',
            message: 'successfully created user',
            user: userToBeCreated
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not create user',
            error
        })
    })

})

router.post('/update', (req, res, next) => {    
    const user = req.body.user 

    db.collection('users').doc(user.id).get().then(prodDoc => {
        if (prodDoc.exists) {
            db.collection('users').doc(user.id).update(user).then(() => {
                myProducer.notify_update_user(user)
            })

            res.json({
                code: 200,
                status: 'success',
                message: `successfully updated user ${user.id}`
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
            message: 'could not update user',
            error
        })
    })

})

router.get('/getall', (req, res, next) => {    
    let users = []
    db.collection('users').get().then((querySnapshot) => {
        querySnapshot.forEach((user) => {
            users.push(user.data())
        })
        
        res.json({
            code: 200,
            status: 'success',
            message: 'successfully fetched all users',
            users: JSON.stringify(users)
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get users',
            error
        })
    })
})

router.get('/get', (req, res, next) => {    
    const userId = req.body.id    
    db.collection('users').doc(userId).get().then(document => {
        if (document.exists) {
            res.json({
                code: 200,
                status: 'success',
                message: `successfully fetched user ${userId}`,
                user: JSON.stringify(document.data())
            })
        } else {
            res.json({
                code: 500,
                status: 'failure',
                message: 'user does not exist',
                error: `[DOCUMENT DOES NOT EXIST]: user with id ${userId} does not exist`
            })
        }    
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'could not get user',
            error
        })
    })
})

module.exports = router;
