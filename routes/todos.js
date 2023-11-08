const express = require('express');
const jsend = require('jsend');
const router = express.Router();
const db = require('../models');
const TodoService = require('../services/TodoService');
const todoService = new TodoService(db);
const CategoryService = require('../services/CategoryService');
const categoryService = new CategoryService(db);
const isAuth = require('../middleware/middleware');
router.use(jsend.middleware);

/* Return all the logged in users todo's with the category associated with each todo and
status that is not the deleted status */
router.get('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Todos']
	// #swagger.description = "Gets all the logged in user's todos. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error retrieving todo items' }
    try {
        const todos = await todoService.getAll(req.user.id);
        const filteredTodos = todos.filter(todo => [1, 2, 3].includes(todo.StatusId));
        res.status(200).jsend.success({ 
            statusCode: 200, 
            result: filteredTodos });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error retrieving todo items.'
        })
    }
});

// Return all the users todos including todos with a deleted status
// Assuming the above means only for the logged in user
router.get('/all', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Todos']
	// #swagger.description = "Gets the list of all todos, including todos with a deleted status. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error retrieving todo items' }
    try {
        const todos = await todoService.getAll(req.user.id);
        res.status(200).jsend.success({ 
            statusCode: 200, 
            result: todos });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error retrieving todo items.'
        })
    }
});

// Return all the todos with the deleted status
// Assuming the above means only for the logged in user
router.get('/deleted', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Todos']
	// #swagger.description = "Gets the list of all todos with the deleted status. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error retrieving todo items' }
    try {
        const todos = await todoService.getAll(req.user.id);
        const deletedTodos = todos.filter(todo => todo.StatusId === 4);
        res.status(200).jsend.success({
            statusCode: 200, 
            result: deletedTodos });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error retrieving todo items.'
        })
    }
});

// Add a new todo with their category for the logged in user
router.post('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Creates a new todo item. <br>The item must be assigned to an existing CategoryId. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
    // #swagger.produces = ['JSON']
    /* #swagger.parameters['Todo'] = { 
		in: 'body', description: 'Add new todo.', type: 'object', 
		schema: { 
			$ref: '#/definitions/Todo'
		}
	} */
    // #swagger.responses[200] = { description: 'Todo created' }
    // #swagger.responses[400] = { description: 'Name/description/CategoryId/StatusId is required' }
    // #swagger.responses[400] = { description: 'Name/description needs to be a string' }
    // #swagger.responses[400] = { description: 'CategoryId/StatusId needs to be an integer' }
    // #swagger.responses[400] = { description: 'CategoryId not found' }
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error creating todo' }
    try {
        const { name, description, CategoryId, StatusId } = req.body;        
        if (name == null || description == null || CategoryId == null || StatusId == null) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "Please provide a name, description, CategoryId, and StatusId.",
            });
        }
        if (!isNaN(name)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The name needs to be a string.",
            });
        }
        if (!isNaN(description)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The description needs to be a string.",
            });
        }
        if (isNaN(CategoryId)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The CategoryId needs to be an integer.",
            });
        }
        if (isNaN(StatusId)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The StatusId needs to be an integer.",
            });
        }
        const category = await categoryService.getOne(CategoryId, req.user.id);
        if (!category) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "CategoryId not found."
            });
        }
        const result = await todoService.create(req.user.id, name, description, CategoryId, StatusId, req.user.id);
        res.status(200).jsend.success({
            statusCode: 200, 
            result: result });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error creating todo.'
        });
    }
});

// Return all the statuses from the database - MOVED TO ROUTES/status.js
/*router.get('/statuses', (req, res) => {
	return;
});*/

// Change/update a specific todo for logged in user
router.put('/:id', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Todos']
    // #swagger.description = "Updates a todo item. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
    // #swagger.produces = ['JSON']
    /* #swagger.parameters['Todo'] = { 
		in: 'body', description: 'Update todo.', type: 'object', 
		schema: { 
			$ref: '#/definitions/Todo'
		}
	} */
    // #swagger.responses[400] = { description: 'CategoryId not found' }
    // #swagger.responses[400] = { description: 'Name/description needs to be a string' }
    // #swagger.responses[400] = { description: 'CategoryId/StatusId needs to be an integer' }
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[404] = { description: 'Todo not found' }
    // #swagger.responses[500] = { description: 'Error updating category' }
    try {
        const id = Number.parseInt(req.params.id);
        const { name, description, CategoryId, StatusId } = req.body;
        const todo = await todoService.getOne(id, req.user.id);
        if (!todo) {
            return res.status(404).jsend.fail({ 
                statusCode: 404,
                result: 'Todo not found' });
        }
        if (name == null || description == null || CategoryId == null || StatusId == null) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "Please provide a name, description, CategoryId, and StatusId.",
            });
        }
        if (!isNaN(name)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The name needs to be a string.",
            });
        }
        if (!isNaN(description)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The description needs to be a string.",
            });
        }
        if (isNaN(CategoryId)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The CategoryId needs to be an integer.",
            });
        }
        if (isNaN(StatusId)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "The StatusId needs to be an integer.",
            });
        }
        const category = await categoryService.getOne(CategoryId, req.user.id);
        if (!category) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: "CategoryId not found."
            });
        }
        const result = await todoService.update(id, req.user.id, name, description, CategoryId, StatusId, req.user.id);
        res.status(200).jsend.success({
            statusCode: 200, 
            result: result });
    } catch (err) {
        return res.status(500).jsend.error({
            message: 'Error updating todo.'
        })
    }
});

// Delete a specific todo if for the logged in user
const DELETED_STATUS_ID = 4;
router.delete('/:id', isAuth, async (req, res, next) => {
	// #swagger.tags = ['Todos']
  	// #swagger.description = "Deletes a todo item. <br>This will set the StatusId to 'Deleted'. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[200] = { description: 'Todo marked as deleted' }
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[404] = { description: 'Todo not found' }
    // #swagger.responses[500] = { description: 'Error deleting todo' }
    try {
        const id = Number.parseInt(req.params.id);
        const todo = await todoService.getOne(id, req.user.id);
        if (!todo) {
            return res.status(404).jsend.fail({ 
                statusCode: 404,
                result: 'Todo not found' });
        }
        const result = await todoService.delete(id, DELETED_STATUS_ID, req.user.id);
        res.status(200).jsend.success({
            statusCode: 200, 
            result: 'Todo marked as deleted.' });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error deleting todo.'
        })
    }
});

module.exports = router;