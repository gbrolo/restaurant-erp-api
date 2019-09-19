const request = require('supertest')
const app = require('../app')

describe('test jest is running', () => {
    it('should pass', async () => {
        expect(true).toBe(true)
    })
})

describe('get all receipts', () => {
    it('should return all receipts', async () => {
        const res = await request(app)
            .get('/receipts/getall')
            
        expect(res.statusCode).toEqual(200)        
    })
})

describe('get all users', () => {
    it('should return all users', async () => {
        const res = await request(app)
            .get('/users/getall')
            
        expect(res.statusCode).toEqual(200)        
    })
})

describe('get all products', () => {
    it('should return all products', async () => {
        const res = await request(app)
            .get('/products/getall')
            
        expect(res.statusCode).toEqual(200)        
    })
})

describe('get receipt with ID SdCFji2gra1fZRB5n8Pe', () => {
    it('should return receipt JSON data', async () => {
        const res = await request(app)
            .get('/receipts/get')
            .send({
                id: 'SdCFji2gra1fZRB5n8Pe'
            })
            
        expect(res.statusCode).toEqual(200)        
    })
})
