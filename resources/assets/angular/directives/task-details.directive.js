(function() {
	angular
        .module('app')
        .directive("taskDetails", taskDetails);

    function taskDetails() {
        return {
            restrict: "E",
            templateUrl: '/partials/task-details.html'
        };
    }
})();