const socket = io()

// TODO This should be projects component
// project Component
const projectComponent = {
    template: ` 
    <div class="container">
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th>Projects</th>
                </tr>
                <tr class="active" v-for="project in projects">
                    <td>
                        <p v-bind="project">{{project.name}}</p>
                    </td>
                    <td>
                        <button v-on:click="viewProject(project.id)">Select Project</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: ['projects'],
    methods: {
        viewProject: function(projectId) {
            socket.emit('view-project', projectId)
        }
    }
}

// Task Component displaying an individual task
const tasksComponent = {
    template: ` 
    <div class="container">
        <table class="table table-hover">
            <tbody>
                <tr>
                    <th style="width:200px">Status</th>
                    <th>ToDo</th>
                </tr>
                <tr v-for="task in tasks" class="active">
                    <td>
                        <button v-show="task.status" v-on:click="$emit('toggle', task)" class="btn btn-info">Done</button>
                        <button v-show="!task.status" v-on:click="$emit('toggle', task)" class="btn btn-danger">Not Done</button>
                    </td>
                    <td>{{task.value}}</td>
                </tr>
            </tbody>
        </table>
    </div>`,
    props: ['tasks']
}

const app = new Vue({
    el: '#todo-app',
    data: {
        loggedIn: false,
        //projectSelected: false,
        userName: '',
        user: {},
        users: [],
        project: {},
        projects: [],//[{name: 'Test Project', list: [{status:false, value: "Task 1"}, {status:false, value: "Task 2"}, {status:false, value: "Task 3"} ] }, {name: 'Test Project 2', list: [{status:false, value: "Task 4"}] }],
        addingProject: '',
        addingTask: '',
        currentProject: null,
        error: false
    },
    methods: {
        addProject: function() {
            if(!this.addingProject) return
            socket.emit('add-project', this.addingProject)
        },

        addTask: function() {
            if(!this.addingTask) return
            socket.emit('add-task', {projectId: this.currentProject.id, value: this.addingTask})
        },

        // viewProject: function(projectId) {
        //     socket.emit('view-project', projectId)
        // },

        backToHome: function() {
            socket.emit('return-home')
        },

        toggle: function(task) {
            if(!this.currentProject) return
            socket.emit('toggle', {projectId: this.currentProject.id, taskId: task.id})
        },

        removeAll: function() {
            if(!this.currentProject) return
            socket.emit('remove-all', this.currentProject.id)
        }

    },
    components: {
        'project-component': projectComponent,
        'tasks-component': tasksComponent
    }
})

socket.on('refresh-projects', projects => {
    app.projects = projects
})

// Only received by the client who viewed the project.
socket.on('successful-view-project', project => {
    app.currentProject = project
})

// Only received by the client who returned home.
socket.on('successful-return-home', () => {
    app.currentProject = null
})

socket.on('successful-project', content => {
    app.projects.push(content)
})

socket.on('successful-task', content => {
    if (app.currentProject.id == content.projectId) {
        app.currentProject.list.push(content.task)
    }
})

socket.on('successful-toggle', content => {
    if (app.currentProject.id == content.projectId) {
        const task = app.currentProject.list.find(t => t.id == content.task.id)
        if (task) {
            task.status = content.task.status
        }
    }
})

socket.on('successful-remove-all', content => {
    app.currentProject = content
})


// Messages without data.
// These are only received by the client who adds the task or project.
socket.on('message', (message) => {
    if (message == 'successful-project') {
        // clear the message after success send 
        app.addingProject = ''
    }
    else if (message == 'successful-task') {
        // clear the message after success send 
        app.addingTask = ''
    }
})