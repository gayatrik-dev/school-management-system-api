const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const Student = require('../models/Student');
const mongoose = require('mongoose');

describe('Student API', function () {
    let token;
    let schoolId;
    let studentId;

    before(async function () {
        // @ts-ignore
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

        // Create a school and a superAdmin and get their token
        schoolId = new mongoose.Types.ObjectId();
        token = 'someValidToken'; // Use a valid token for authorization
    });

    afterEach(async function () {
        await Student.deleteMany({});
    });

    after(async function () {
        await mongoose.disconnect();
    });

    describe('POST /api/students/enroll', function () {
        it('should enroll a student', async function () {
            const student = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                dateOfBirth: '2005-01-01',
                schoolId,
            };

            // @ts-ignore
            const res = await request(app)
                .post('/api/students/enroll')
                .set('Authorization', `Bearer ${token}`)
                .send(student);

            studentId = res.body.student._id; // Save student ID for further tests

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.equals('Student enrolled successfully');
        });
    });

    describe('GET /api/students/:studentId', function () {
        it('should get a student by ID', async function () {
            // @ts-ignore
            const res = await request(app)
                .get(`/api/students/${studentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('firstName').that.equals('John');
        });
    });
});