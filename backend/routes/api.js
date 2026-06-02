const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/profile', userController.saveProfile);
router.post('/generate-plan', userController.generatePlan);
router.post('/log-progress', userController.logProgress);

// Route for AI Assistant
router.post('/chat', userController.chatAssistant); 

module.exports = router;