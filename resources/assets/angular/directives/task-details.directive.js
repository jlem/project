(function() {
	angular.module('app')
	.directive("taskDetails", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/task-details.html'
		};
	});
})();