module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    // let users = []
    let projects = [{name: 'Test Project', list: [{status:false, value: "Task 1"}, {status:false, value: "Task 2"}, {status:false, value: "Task 3"} ] }, {name: 'Test Project 2', list: [{status:false, value: "Task 4"}] }]

    io.on('connection', socket => {
        socket.emit('refresh-projects', projects)


        socket.on('add-project', project => {
            const content = {
                name: project.name,
                list: project.list
            }
            projects.push(content)

            io.emit('successful-project', content)
        })

        socket.on('add-task', projectAndTask => {
            const content = {
                projectName: projectAndTask.projectName,
                task: projectAndTask.task
            }
            projects[projectAndTask.projectName].list.push(projectAndTask.task)
            console.log(projects[projectAndTask.projectName])

            // io.emit('successful-task', content)
        })

        // socket.on('disconnect', () => {
        //     // logout the user
        //     db.logoutUser(socket.id)
        //         // update the actives
        //         .then(() => db.activeUsers())
        //         .then(users => io.emit('refresh-users', users))
        // })

    })


}