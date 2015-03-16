(function() {
	angular.module('app')
	.directive("myTaskList", ["$http", function($http) {
		return {
			restrict: "E",
			templateUrl: '/partials/my-task-list.html',
			controller: function($http) {
				this.tasks = [];
				var that = this;
				$http.get('/user/tasks').success(function(data) {
					that.tasks = data;
				});
			},
			controllerAs: 'mtl'
		};
	}]);
})();