const express = require("express");
const request = require("supertest");
const app = express();
//require("dotenv").config();
//const jsend = require('jsend')
const bodyParser = require("body-parser");

const usersRouter = require('../routes/users');
const todosRouter = require('../routes/todos');
const categoriesRouter = require('../routes/categories');
const statusRouter = require('../routes/status');

app.use(bodyParser.json());

app.use('/', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/todos', todosRouter);
app.use('/', statusRouter);

describe('Testing-todo-routes', () => {
    let token;

    test('POST /signup - success', async () => {
        const credentials = {
            name: "testuser",
            email: "test@test.com",
            password: "test"
        }
        const { body } = await request(app).post('/signup').send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('result');
        expect(body.data.result).toBe("You created an account.")
        console.log(body.data.result);
    })

    // Test 1
    test("POST /login - success", async () => {
        const credentials = {
            email: "test@test.com",
            password: "test"
        }
        const { body } = await request(app).post("/login").send(credentials);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("token");
        token = body.data.token
        console.log(body);
    });

    test('POST /categories - success', async () => {
        const credentials = {
            name: "chores"
        }
        const { body } = await request(app).post('/categories').set('Authorization', 'Bearer ' + token).send(credentials)
        expect(body).toHaveProperty('data')
        expect(body.status).toBe('success');
        console.log(body.data.result);
    })

    // Test 3
    let todoId;
    test('POST /todos - success', async () => {
        const credentials = {
            name: "vacuuming",
            description: "vacuume the bedroom",
            CategoryId: 1,
            StatusId: 1
        }
        const { body } = await request(app).post('/todos').set('Authorization', 'Bearer ' + token).send(credentials)
        expect(body).toHaveProperty('data');
        expect(body.status).toBe('success');
        todoId = body.data.result.id;
        console.log(body.data)
    })

    // Test 2
    test('GET /todos - success', async () => {
        const { body } = await request(app).get('/todos').set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('status');
        expect(body.status).toBe('success');
        console.log(body.data.result);
    });

    // Test 4
    test('DELETE /todos/:id - success', async () => {
            const { body } = await request(app)
                .delete('/todos/' + todoId)
                .set('Authorization', 'Bearer ' + token);    
            expect(body).toHaveProperty('status');
            expect(body.status).toBe('success');
            console.log(body.data.result);
    });

    test('DELETE /todos/:id - fail', async () => {
        const { body } = await request(app)
            .delete('/todos/' + 400)
            .set('Authorization', 'Bearer ' + token);    
        expect(body).toHaveProperty('status');
        expect(body.status).toBe('fail');
        console.log(body.data.result);
});

    // Test 5
    test('GET /todos without token - fail', async () => {
        const { body } = await request(app).get('/todos')
        expect(body).toHaveProperty('status');
        expect(body.status).toBe('fail');
        console.log(body.data.result);
    })

    // Test 6
    test('GET /todos with invalid token - error', async () => {
        const { body } = await request(app).get('/todos').set('Authorization', 'Bearer invalidToken')
        expect(body).toHaveProperty('status');
        expect(body.status).toBe('error');
        console.log(body.message);
    })
});