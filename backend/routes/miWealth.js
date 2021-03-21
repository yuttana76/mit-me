const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const mi_tokenAuth = require('../middleware/by-mi-token');
const { check } = require('express-validator');

const miWealthController = require('../controllers/miWealth')

// 1. Authentication
router.get("/hellomi/",miWealthController.hellomi);

router.get("/getPortDetailByAgents/"
,[check('agent_list').exists()]
,[check('as_of_date').isLength({ min: 10,max:10 }).withMessage('Request parameters')]
,mi_tokenAuth,miWealthController.getPortDetailByAgents_V2); // Doing

router.get("/getPortDetailByPort/"
,[check('product').exists()]
,[check('portfolio_code').isLength({ min: 1 }).withMessage('Request parameters')]
,[check('as_of_date').isLength({ min: 10,max:10 }).withMessage('Request parameters')]
,mi_tokenAuth,miWealthController.getPortDetailByPort);

router.get("/getCommission/",mi_tokenAuth,miWealthController.getCommission);

module.exports = router;
