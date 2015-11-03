(function() {
	angular
        .module('app')
        .directive("projectDetails", projectDetails);

    function projectDetails() {
        return {
            restrict: "E",
            templateUrl: '/partials/project-details.html'
        };
    }
})();