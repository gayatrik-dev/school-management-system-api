const request = require('supertest');
const app = require('../app'); // Import the Express app
const { expect } = require('chai');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('User API', function () {
    let token;

    // Connect to a temporary in-memory database before running the tests
    before(async function () {
        // You can also use `mongodb-memory-server` to mock a database
        await mongoose.connect('mongodb://localhost:27017/test');
    });

    // Clean up the database after each test
    afterEach(async function () {
        await User.deleteMany({});
    });

    // Disconnect after all tests are completed
    after(async function () {
        await mongoose.disconnect();
    });

    describe('POST /api/user/register', function () {
        it('should register a new user', async function () {
            const user = {
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'schoolAdmin',
            };

            // @ts-ignore
            const res = await request(app).post('/api/auth/register').send(user);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.equals('User registered successfully');
        });
    });

    describe('POST /api/user/login', function () {
        it('should login a registered user', async function () {
            // Register the user first
            const user = {
                firstName: 'Test',
                lastName: 'User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'schoolAdmin',
            };

            // @ts-ignore
            await request(app).post('/api/user/register').send(user);

            // Now log in
            // @ts-ignore
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'password123' });

            token = res.body.token; // Save the token for further tests

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('token');
        });
    });
});