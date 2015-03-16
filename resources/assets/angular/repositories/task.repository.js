(function() {
	angular.module('app')
	.service('TaskRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/task').success(function(data) {
					model.allProjects = data;
				});
			},
			find : function(taskID, model) {
				$http.get('/task/'+taskID).success(function(data) {
					model.currentTask = data;
				});
			},
			byProject : function(model) {
				$http.get('/project/'+id+'/tasks').success(function(data) {
					model.tasks = data;
				});
			},
			authUser : function(model) {
				$http.get('/user/tasks').success(function(data) {
					model.authUserTasks = data;
				});
			}
		};
	}]);
})();