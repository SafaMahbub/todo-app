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

        socket.on('add-task', task => {
            const content = {
                projectName: task.projectName,
                status: false,
                value: task.value
            }

            for (let i = 0; i < projects.length; i++) {
                if(projects[i].name.toLowerCase().trim() === task.projectName.toLowerCase().trim()) {
                    projects[i].list.push({ status: false, value: task.value})
                    break
                }
            }

            io.emit('successful-task', content)
        })

        socket.on('remove-all', currectProject => {
            const content = {
                name: currectProject.name,
                list: []
            }

            for (let i = 0; i < projects.length; i++) {
                if(projects[i].name.toLowerCase().trim() === content.name.toLowerCase().trim()) {
                    projects[i].list = []
                    break
                }
            }

            io.emit('successful-remove-all', content)

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