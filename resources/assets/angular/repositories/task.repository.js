(function() {
	angular
        .module('app')
	    .service('TaskRepository', TaskRepository);

    TaskRepository.$inject = ['$http'];

    function TaskRepository($http) {

        // API
        return {
            all: all,
            find: find,
            byProject: byProject,
            authUser: authUser
        };

        // Implementation
        function all(model) {
            $http.get('/task').success(function(data) {
                model.setAllProjects(data);
            });
        }

        function find(taskID, model) {
            $http.get('/task/'+taskID).success(function(data) {
                model.setCurrentTask(data);
            });
        }

        function byProject(id, model) {
            $http.get('/project/'+id+'/tasks').success(function(data) {
                model.tasks = data;
            });
        }

        function authUser(model) {
            $http.get('/user/tasks').success(function(data) {
                model.authUserTasks = data;
            });
        }
    }
})();