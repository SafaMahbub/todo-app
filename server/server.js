const
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path')

const projects = [{name: 'Test Project', list: [{status:false, value: "Task 1"}, {status:false, value: "Task 2"}, {status:false, value: "Task 3"} ] }, {name: 'Test Project 2', list: [{status:false, value: "Task 4"}] }]
const sockets = require('./sockets')(server, projects)

app.use(express.static(path.join(__dirname, '..', '/client')))
app.use(express.json());

app.post("/add-project", (request, response) => {
    projects.push(request.body) // This is dangerous (?)
    sockets.sendUpdated();
})

const port = 8080;
server.listen(port)
console.log(`Server listening on port ${port}`)