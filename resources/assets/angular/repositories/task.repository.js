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
        function all(success) {
            $http.get('/task').success(success);
        }

        function find(taskID, success) {
            $http.get('/task/'+taskID).success(success);
        }

        function byProject(id, success) {
            $http.get('/project/'+id+'/tasks').success(success);
        }

        function authUser(model) {
            $http.get('/user/tasks').success(success);
        }
    }
})();