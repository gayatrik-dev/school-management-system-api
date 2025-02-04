const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const Classroom = require('../models/Classroom');
const mongoose = require('mongoose');

describe('Classroom API', function () {
    let token;
    let schoolId;
    let classroomId;

    before(async function () {
        // @ts-ignore
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

        // Assume you already have a school created from previous tests
        schoolId = new mongoose.Types.ObjectId();
        token = 'someValidToken'; // Use a valid token for authorization
    });

    afterEach(async function () {
        await Classroom.deleteMany({});
    });

    after(async function () {
        await mongoose.disconnect();
    });

    describe('POST /api/classrooms', function () {
        it('should create a new classroom', async function () {
            const classroom = {
                name: 'Classroom 101',
                capacity: 30,
                school: schoolId,
            };

            // @ts-ignore
            const res = await request(app)
                .post('/api/classrooms')
                .set('Authorization', `Bearer ${token}`)
                .send(classroom);

            classroomId = res.body.classroom._id; // Save classroom ID for further tests

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message').that.equals('Classroom created successfully');
        });
    });

    describe('GET /api/classrooms/:id', function () {
        it('should get a classroom by ID', async function () {
            // @ts-ignore
            const res = await request(app)
                .get(`/api/classrooms/${classroomId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name').that.equals('Classroom 101');
        });
    });
});