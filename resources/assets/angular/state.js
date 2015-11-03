(function() {
    angular
        .module('app')
        .factory('ApplicationState', ApplicationState);

    function ApplicationState() {

        // Private State
        var state = {
            context: "home",
            rightContext: "home",
            currentProject: {},
            currentTask: {},
            allProjects: [],
            authUserProjects: []
        };

        // API
        return {

            // Context
            changeToProjectContext: changeToProjectContext,
            changeToTaskContext: changeToTaskContext,
            getContext: getContext,
            getRightContext: getRightContext,

            // Projects
            isActiveProject: isActiveProject,
            setCurrentProject: setCurrentProject,
            getCurrentProject: getCurrentProject,
            setAllProjects: setAllProjects,
            getAllProjects: getAllProjects,
            setAuthUserProjects: setAuthUserProjects,
            getAuthUserProjects: getAuthUserProjects,

            // Tasks
            isActiveTask: isActiveTask,
            getCurrentTask: getCurrentTask,
            setCurrentTask: setCurrentTask,
            getTaskLink: getTaskLink
        };

        // Implementation
        function changeToProjectContext() {
            state.context = 'project';
            state.rightContext = 'project';
        }

        function changeToTaskContext() {
            state.context = 'project';
            state.rightContext = 'task';
        }

        function getContext() {
            return state.context;
        }

        function getRightContext() {
            return state.rightContext;
        }

        function isActiveProject(index) {
            return this.getCurrentProject().id == index && this.getContext() == "project";
        }

        function setCurrentProject(project) {
            state.currentProject = project;
        }

        function getCurrentProject() {
            return state.currentProject;
        }

        function setAllProjects(projects) {
            state.allProjects = projects;
        }

        function getAllProjects() {
            return state.allProjects;
        }

        function setCurrentTask(currentTask) {
            state.currentTask = currentTask;
        }

        function getCurrentTask() {
            return state.currentTask;
        }

        function isActiveTask(index) {
            return this.getCurrentTask().id == index && this.getRightContext() == "task";
        }

        function setAuthUserProjects(projects) {
            state.authUserProjects = projects;
        }

        function getAuthUserProjects() {
            return state.authUserProjects;
        }

        function getTaskLink(task) {
            var url = '#/project/'+task.project_id;
            if (!this.isActiveTask(task.id)) {
                url = url+'/task/'+task.id;
            }
            return url;
        }
    }
})();