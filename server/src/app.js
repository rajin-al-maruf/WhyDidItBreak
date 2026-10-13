const express = require('express');

const app = express()

app.get('/api/health', (req, res) => {
    res.status(200).json({message:  "Ok"})
})

module.exports = app;