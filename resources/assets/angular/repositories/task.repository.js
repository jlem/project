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
        function all(state) {
            $http.get('/task').success(function(data) {
                state.setAllProjects(data);
            });
        }

        function find(taskID, state) {
            $http.get('/task/'+taskID).success(function(data) {
                state.setCurrentTask(data);
            });
        }

        function byProject(id, state) {
            $http.get('/project/'+id+'/tasks').success(function(data) {
                state.tasks = data;
            });
        }

        function authUser(model) {
            $http.get('/user/tasks').success(function(data) {
                model.authUserTasks = data;
            });
        }
    }
})();