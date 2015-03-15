(function() {
	angular.module('app')
	.service('ProjectRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/project').success(function(data) {
					model.allProjects = data;
				});
			},
			authUser : function(model) {
				$http.get('/user/projects').success(function(data) {
					model.authUserProjects = data;
				});
			}
		};
	}]);
})();