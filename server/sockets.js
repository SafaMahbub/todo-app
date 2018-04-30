module.exports = (server, projects) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let sockets = []

    io.on('connection', socket => {

        sockets.push(socket);

        socket.emit('refresh-projects', projects)

        // socket.on('add-project', project => {
        //     io.emit('successful-project', content)
        // })

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

        socket.on('toggle', data => {
            const content = {
                name: data.currentProject.name,
                status: data.changingTask.status ? false : true,
                value : data.changingTask.value
            }

            for (let i = 0; i < projects.length; i++) {
                if(projects[i].name.toLowerCase().trim() === content.name.toLowerCase().trim()) {
                    for(let j = 0; j < projects[i].list.length; j++) {
                        if (projects[i].list[j].value.toLowerCase().trim() === content.value.toLowerCase().trim()) {
                            projects[i].list[j].status = content.status
                        }
                    }
                }
            }

            io.emit('successful-toggle', content)

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

        socket.on('disconnect', () => {
            sockets = sockets.filter(s => s != socket);
        })

    })

    return {
        sendUpdated: () => {
            sockets.forEach(s => s.emit('refresh-projects', projects))
        }
    }

}