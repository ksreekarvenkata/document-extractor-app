// /backend/routes/index.js
const express = require('express');
const Router = express.Router();

const authRoutes = require('./authRoutes');

Router.use('/api', authRoutes); // All routes under /api

module.exports = Router;