// project Component
const projectComponent = {
    template: ` 
                <div class="container">
                    <table class="table table-hover">
                        <th>Projects</th>
                        <tr class="active" v-for="project in projects">
                            <td>
                                <p v-bind="project">{{project.name}}</p>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </table>
                </div>`,
    props: ['projects']
}

const socket = io()
const app = new Vue({
    el: '#todo-app',
    data: {
        loggedIn: false,
        projectSelected: false,
        userName: '',
        user: {},
        users: [],
        project: {},
        projects: [],//[{name: 'Test Project', list: [{status:false, value: "Task 1"}, {status:false, value: "Task 2"}, {status:false, value: "Task 3"} ] }, {name: 'Test Project 2', list: [{status:false, value: "Task 4"}] }],
        addingProject: '',
        addingTask: '',
        currentProject: {}, //{name: 'Test Project', list: [{status:false, value: "Hello"}] },
        error: false
    },
    methods: {
        addProject: function() {
            if(!this.addingProject) return
            socket.emit('add-project', {name: this.addingProject, list: [] })
        },

        addTask: function() {
            if(!this.addingTask) return
            socket.emit('add-task', {projectName: this.currentProject, task: {status:false, value: this.addingTask }})
        },

        getProjectInfo: function(project) {

            let viewModel = this

            let match = false

            for (let i = 0; i < viewModel.projects.length; i++) {
                if (viewModel.projects[i].name.toLowerCase().trim() == project.name.toLowerCase().trim()) {
                    viewModel.currentProject = viewModel.projects[i]
                    match = true
                    break
                }
            }

            if(match) viewModel.projectSelected = true

        },

        backToHome: function() {
            let viewModel = this
            viewModel.projectSelected = false
        },

        toggle: function(task) {
            let viewModel = this

            for (let i = 0; i < viewModel.currentProject.list.length; i++) {
                if (viewModel.currentProject.list[i].value.toLowerCase().trim() == task.value.toLowerCase().trim()) {
                    if (viewModel.currentProject.list[i].status) viewModel.currentProject.list[i].status = false
                    else viewModel.currentProject.list[i].status = true
                }
            }
        },

        removeAll: function(){
            let viewModel = this

            for (let i = 0; i < viewModel.projects.length; i++) {
                if(viewModel.projects[i].name == viewModel.currentProject.name) {
                    viewModel.projects[i].list = []
                }
            }
        }

    },
    components: {
        'project-component': projectComponent
    }
})

// socket.on('add-project', content => {
//     // clear the message after success send
//     app.addingProject = ''
//     app.projects.push(content)
// })

socket.on('refresh-projects', projects => {
    app.projects = projects
})

socket.on('successful-project', content => {
    // clear the message after success send
    app.addingProject = ''
    app.projects.push(content)
})

socket.on('successful-task', content => {
    // clear the message after success send
    app.addingTask = ''

    app.projects[content.projectName].list.push(content.task)
})