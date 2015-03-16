(function() {
	angular.module('app')
	.factory('MainViewModel', function() {
		return {
            context: "home",
            rightContext: "home",
            allProjects: [],
			authUserProjects: [],
            activeProject: null,
            currentProject: {},
            activeTask: null,
            currentTask: {},
            
            isActiveProject: function(index) {
                return this.activeProject == index && this.context == "project";
            },
            setActiveProject: function(index) {
                this.activeProject = index;
            },
            isActiveTask: function(index) {
                return this.activeTask == index && this.rightContext == "task";
            },
            setActiveTask: function(index) {
                this.activeTask = index;
            },
            setContext: function(context) {
                this.context = context;
            },
            setRightContext: function(context) {
                this.rightContext = context;
            },
            getTaskLink: function(task) {
                var url = '#/project/'+task.project_id;
                if (!this.isActiveTask(task.id)) {
                    url = url+'/task/'+task.id;
                }
                return url;
            }
		};
	});
})();