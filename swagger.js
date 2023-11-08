const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "ToDo - by MK (API CA)",
        description: "This is an application for todos within categories for logged in users. <br>Create a user, view/add/update/delete your todo items and categories. <br>All endpoints regarding the todos- and categories functionalities require a valid JWT token. The token expires after one hour."
    },
    host: "localhost:3000",
    definitions: {
        Signup: {
            $name: "JohnDoe",
            $email: "johnDoe@test.com",
            $password: "password"
        },
        Login: {
            $email: "johnDoe@test.com",
            $password: "password"
        },
        Category: {
            $name: "Chores"
        },
        Todo: {
            $name: "Vacuuming",
            $description: "Vacuuming bedroom",
            $CategoryId: 1,
            $StatusId: 1
        }
    }
}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www')
})