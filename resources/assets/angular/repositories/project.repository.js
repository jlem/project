(function() {
	angular
        .module('app')
	    .service('ProjectRepository', ProjectRepository);

    ProjectRepository.$inject = ['$http'];

    function ProjectRepository($http) {

        // API
        return {
            all: all,
            find: find,
            authUser: authUser
        };

        // Implementation
        function all(success) {
            $http.get('/project').success(success);
        }

        function find(id, success) {
            $http.get('/project/'+id).success(success);
        }

        function authUser(success) {
            $http.get('/user/projects').success(success);
        }
    }

})();