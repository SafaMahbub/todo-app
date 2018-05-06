const
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path')
    data = require('./data')

const sockets = require('./sockets')(server, data)

app.use(express.static(path.join(__dirname, '..', '/client')))
app.use(express.json());

const port = 8080;
server.listen(port)
console.log(`Server listening on port ${port}`)