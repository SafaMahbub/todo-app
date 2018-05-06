module.exports = (server, data) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let sockets = []

    /** Sends an updated project list to all the clients. */
    const sendProjectsUpdated = () => {
        io.emit('refresh-projects', data.getAllProjectNames())
    }

    /** Sends an update to only the clients who are viewing the particular project. */
    const sendProjectUpdate = (message, projectId, content) => {
        sockets
            .filter(s => s.projectId == projectId)
            .forEach(s => s.socket.emit(message, content))
    }

    io.on('connection', socket => {

        sockets.push({
            socket: socket,
            projectId: null // Which project the client is currently viewing.
        });

        socket.emit('refresh-projects', data.getAllProjectNames())

        socket.on('add-project', projectName => {
            const project = data.addProject(projectName)
            io.emit('successful-project', {
                id: project.id,
                name: project.name
            })
            socket.send('successful-project')
        })

        socket.on('view-project', projectId => {
            sockets.find(s => s.socket == socket).projectId = projectId;
            socket.emit('successful-view-project', data.getProject(projectId))
        })

        socket.on('return-home', () => {
            sockets.find(s => s.socket == socket).projectId = null;
            socket.emit('successful-return-home')
        })

        socket.on('add-task', content => {
            const task = data.addTask(content.projectId, content.value)
            sendProjectUpdate('successful-task', content.projectId, {
                projectId: content.projectId,
                task: task
            })
            socket.send('successful-task')
        })

        socket.on('toggle', content => {
            const task = data.toggleTask(content.projectId, content.taskId)
            sendProjectUpdate('successful-toggle', content.projectId, {
                projectId: content.projectId,
                task: task
            })
        })

        socket.on('remove-all', projectId => {
            const task = data.removeCompleted(projectId)
            socket.emit('successful-remove-all', task)
            sendProjectUpdate('successful-remove-all', projectId, data.getProject(projectId))
        })

        socket.on('disconnect', () => {
            sockets = sockets.filter(s => s.socket != socket)
        })

    })

}