const express = require('express');

const app = express()

app.use(express.json({ limit: '10kb' }));

const userRoutes = require('./routes/user.route.js');

app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).send('WhyDidItBreak API is up and running! 🚀');
})

module.exports = app;