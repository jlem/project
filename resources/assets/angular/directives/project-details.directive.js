(function() {
	angular.module('app')
	.directive("projectDetails", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/project-details.html'
		};
	});
})();