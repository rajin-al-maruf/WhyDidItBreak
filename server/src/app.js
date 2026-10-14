const express = require('express');

const app = express()

app.use(express.json({ limit: '10kb' }));

const userRoutes = require('./routes/user.route.js');
const projectRoutes = require('./routes/project.routes');

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).send('WhyDidItBreak API is up and running! 🚀');
})

module.exports = app;