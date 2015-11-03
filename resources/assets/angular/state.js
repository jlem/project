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
            activeProject: null,
            currentTask: {},
            allProjects: [],
            authUserProjects: [],
            activeTask: null
        };

        // API
        return {

            // Context
            setContext: setContext,
            getContext: getContext,
            setRightContext: setRightContext,
            getRightContext: getRightContext,

            // Projects
            isActiveProject: isActiveProject,
            setActiveProject: setActiveProject,
            getActiveProject: getActiveProject,
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
            setActiveTask: setActiveTask,
            getActiveTask: getActiveTask,
            getTaskLink: getTaskLink
        };

        // Implementation
        function setContext(context) {
            state.context = context;
        }

        function getContext() {
            return state.context;
        }

        function setRightContext(context) {
            state.rightContext = context;
        }

        function getRightContext() {
            return state.rightContext;
        }

        function isActiveProject(index) {
            return this.getActiveProject() == index && this.getContext() == "project";
        }

        function setActiveProject(index) {
            state.activeProject = index;
        }

        function getActiveProject() {
            return state.activeProject;
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
            return this.getActiveTask() == index && this.getRightContext() == "task";
        }

        function setActiveTask(index) {
            state.activeTask = index;
        }

        function getActiveTask() {
            return state.activeTask;
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