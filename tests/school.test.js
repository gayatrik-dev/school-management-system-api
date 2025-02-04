const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const School = require('../models/School');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('School API', function () {
    let token;
    let schoolId;

    before(async function () {
        // @ts-ignore
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

        // Register a superAdmin and get the token
        const admin = {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@example.com',
            password: 'admin123',
            role: 'superAdmin',
        };
        // @ts-ignore
        const res = await request(app).post('/api/auth/register').send(admin);
        token = res.body.token; // Save token for creating schools
    });

    afterEach(async function () {
        await School.deleteMany({});
    });

    after(async function () {
        await mongoose.disconnect();
    });

    describe('POST /api/schools', function () {
        it('should create a new school', async function () {
            const school = {
                name: 'Test School',
                address: '123 Test St',
                createdBy: new mongoose.Types.ObjectId(),
            };

            // @ts-ignore
            const res = await request(app)
                .post('/api/schools')
                .set('Authorization', `Bearer ${token}`)
                .send(school);

            schoolId = res.body.school._id; // Save school ID for further tests

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.equals('School created successfully');
        });
    });

    describe('GET /api/schools/:id', function () {
        it('should get a school by ID', async function () {
            // @ts-ignore
            const res = await request(app).get(`/api/schools/${schoolId}`).set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name').that.equals('Test School');
        });
    });
});