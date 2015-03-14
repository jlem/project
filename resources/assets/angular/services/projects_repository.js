(function() {
	angular.module('app')
	.service('ProjectRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/project').success(function(data) {
					model.projects = data;
				});
			}
		};
	}]);
})();