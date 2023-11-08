const express = require('express');
const jsend = require('jsend');
const router = express.Router();
const db = require('../models');
const StatusService = require('../services/StatusService');
const statusService = new StatusService(db);
const isAuth = require('../middleware/middleware');

router.use(jsend.middleware);

router.get('/statuses', isAuth, async (req, res, next) => {
    // #swagger.tags = ['Status']
	// #swagger.description = "Gets the list of all statuses. Type 'Bearer ' + the token in Authorization to access this endpoint."
	// #swagger.produces = ['JSON']
    // #swagger.responses[401] = { description: 'No token provided' }
    // #swagger.responses[500] = { description: 'Error retrieving statuses' }
    try {
        const statuses = await statusService.getAllStatuses(req.user.id);
        res.status(200).jsend.success({
            statusCode: 200, 
            result: statuses });
    } catch (error) {
        return res.status(500).jsend.error({
            message: 'Error retrieving statuses.'
        })
    }
});

module.exports = router;