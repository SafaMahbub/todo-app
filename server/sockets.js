module.exports = (server,) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')


    // let users = []
    const projects = []

    io.on('connection', socket => {
        socket.emit('refresh-projects', projects)


        socket.on('add-project', project => {
            const content = {
                name: project.name,
                list: projct.list
            }
            projects.push(content)

            io.emit('successful-project', content)
        })

        socket.on('disconnect', () => {
            // logout the user
            // db.logoutUser(socket.id)
            //     // update the actives
            //     .then(() => db.activeUsers())
            //     .then(users => io.emit('refresh-users', users))
        })

    })


}