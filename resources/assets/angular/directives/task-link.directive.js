(function() {
	angular.module('app')
	.directive("taskLink", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/task-link.html'
		};
	});
})();