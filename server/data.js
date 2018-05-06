// Default Projects
const projects = [
    {
        id: 1,
        name: 'Test Project',
        nextItemId: 4,
        list: [
            {
                id: 1,
                status:false,
                value: "Task 1"
            },
            {
                id: 2,
                status:false,
                value: "Task 2"
            },
            {
                id: 3,
                status:false,
                value: "Task 3"
            }
        ]
    },
    {
        id: 2,
        name: 'Test Project 2',
        nextItemId: 2,
        list: [
            {
                id: 1,
                status:false,
                value: "Task 4"
            }
        ]
    }
]

let nextProjectId = 3

module.exports.getAllProjectNames = () => {
    return projects.map(p => {
        return {
            id: p.id,
            name: p.name
        }
    });
}

module.exports.getProject = (projectId) => {
    return projects.find(p => p.id == projectId)
}

module.exports.addProject = (projectName) => {
    const project = {
        id: nextProjectId++,
        name: projectName,
        nextItemId: 1,
        list: []
    }
    projects.push(project)
    return project
}

module.exports.addTask = (projectId, taskName) => {
    const project = projects.find(p => p.id == projectId)
    if (project) {
        const task = {
            id: project.nextItemId++,
            status: false,
            value: taskName
        }
        project.list.push(task)
        return task
    }
}

module.exports.toggleTask = (projectId, taskId) => {
    const project = projects.find(p => p.id == projectId)
    if (project) {
        const task = project.list.find(t => t.id == taskId)
        if (task) {
            task.status = !task.status 
            return task
        }
    }
}

module.exports.removeAll = (projectId) => {
    const project = projects.find(p => p.id == projectId)
    if (project) {
        project.list = project.list.filter(t => !t.status)
        return project
    }
}
