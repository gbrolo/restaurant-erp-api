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

const { UsersProvider } = require('./users/UsersProvider')
const usersProvider = new UsersProvider()

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
                res.end(JSON.stringify({status: 'success', sessionCookie, options}))
            }).catch(error => {                
                res.status(401).send('UNAUTHORIZED REQUEST!')
            })
        })
    }).then(() => {
        return auth.signOut()
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: error,
            error
        })
    })
})

router.post('/islogged', (req, res) => {
    var sessionCookie = req.cookies.session || '';
    admin.auth().verifySessionCookie(sessionCookie).then((decodedToken) => {        
        res.json({
            code: 200,
            status: 'success',
            message: 'user is logged in',        
        })
    }).catch(error => {
        res.json({
            code: 500,
            status: 'failure',
            message: 'user not logged',
            error
        })
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
    const user = JSON.parse(req.body.user) 

    usersProvider.update(user).then(json => {
        res.json(json)
        myProducer.notify_update_user(user)
    }).catch(json => {
        res.json(json)
    })

})

router.get('/getall', (req, res, next) => {  
    usersProvider.getAll().then(json => res.json(json)).catch(json => res.json(json))      
})

router.get('/get', (req, res, next) => {    
    const userId = req.body.userId    

    usersProvider.get(userId).then(json => res.json(json)).catch(json => res.json(json))    
})

module.exports = router;
