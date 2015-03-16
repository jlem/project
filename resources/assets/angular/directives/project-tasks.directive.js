(function() {
	angular.module('app')
	.directive("projectTasks", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/project-tasks.html'
		};
	});
})();