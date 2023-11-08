const express = require('express');
const jsend = require('jsend');
const router = express.Router();
const db = require('../models');
const CategoryService = require('../services/CategoryService');
const categoryService = new CategoryService(db);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const isAuth = require('../middleware/middleware');

router.use(jsend.middleware);

router.get('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Categories']
	// #swagger.description = "Gets the list of all categories. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error retrieving categories' }
    try {
        const categories = await categoryService.getAll(req.user.id);
        res.status(200).jsend.success({ statusCode: 200, result: categories });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error retrieving categories.'
        });
    }
});

router.post('/', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Creates a new category. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
	/* #swagger.parameters['Category'] = { 
		in: 'body', description: 'Add new category.', type: 'object', 
		schema: { 
			$ref: '#/definitions/Category'
		}
	} */
    // #swagger.responses[200] = { description: 'New category created' }
    // #swagger.responses[400] = { description: 'Name required' }
    // #swagger.responses[400] = { description: 'Name needs to be a string' }
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error creating category' }
    try {
        const { name  } = req.body;
        if (name == null) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: 'Please provide a category name.',
            });
        }
        if (!isNaN(name)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: 'The category name needs to be a string.',
            });
        }
        const result = await categoryService.create(name, req.user.id);
        res.status(200).jsend.success({ statusCode: 200, result: 'New category created.' });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error creating category.'
        });
    }
});

router.put('/:id', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Updates a category. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
	/* #swagger.parameters['Category'] = { 
		in: 'body', description: 'Update category.', type: 'object', 
		schema: { 
			$ref: '#/definitions/Category'
		}
	} */
    // #swagger.responses[400] = { description: 'Name needs to be a string' }
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[404] = { description: 'Category not found' }
    // #swagger.responses[500] = { description: 'Error updating category' }
    try {
        const id = Number.parseInt(req.params.id);
        const { name } = req.body;
        const category = await categoryService.getOne(id, req.user.id);
        if (!category) return res.status(404).jsend.fail({ 
            statusCode: 404,
            result: 'Category not found' });
        if (!isNaN(name)) {
            return res.status(400).jsend.fail({
                statusCode: 400,
                result: 'The category name needs to be a string.',
            });
        }
        const result = await categoryService.update(id, req.user.id, name);
        res.status(200).jsend.success({ 
            statusCode: 200, 
            result: result });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error updating category.'
        })
    }
});

router.delete('/:id', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Categories']
  	// #swagger.description = "Deletes a category. <br>Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[404] = { description: 'Category not found' }
    // #swagger.responses[500] = { description: 'Error deleting category' }
    try {
        const id = Number.parseInt(req.params.id);
        const category = await categoryService.getOne(id, req.user.id);
        if (!category) return res.status(404).jsend.fail({ 
            statusCode: 404,
            result:'Category not found' });
        const result = await categoryService.delete(id);
        res.status(200).jsend.success({ 
            statusCode: 200, 
            result: result });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Cannot delete category with todo item(s).'
        });
    }
});

module.exports = router;