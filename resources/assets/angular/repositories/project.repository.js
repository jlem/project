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
        function all(state) {
            $http.get('/project').success(function(data) {
                state.setAllProjects(data);
            });
        }

        function find(id, state) {
            $http.get('/project/'+id).success(function(data) {
                state.setCurrentProject(data);
            });
        }

        function authUser(state) {
            $http.get('/user/projects').success(function(data) {
                state.setAuthUserProjects(data);
            });
        }
    }

})();