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
        function all(model) {
            $http.get('/project').success(function(data) {
                model.setAllProjects(data);
            });
        }

        function find(id, model) {
            $http.get('/project/'+id).success(function(data) {
                model.setCurrentProject(data);
            });
        }

        function authUser(model) {
            $http.get('/user/projects').success(function(data) {
                model.setAuthUserProjects(data);
            });
        }
    }

})();