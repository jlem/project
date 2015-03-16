(function() {
	var app = angular.module('app', ['ngRoute']);
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/project/:projectID', {
				templateUrl: '/partials/null.html',
				controller: 'ProjectController'
			}).
			when('/project/:projectID/task/:taskID', {
				templateUrl: '/partials/null.html',
				controller: 'TaskController'
			})
			.otherwise({
		        redirectTo: '/'
		    });
	}]);
})();