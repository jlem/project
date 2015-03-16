(function() {
	angular.module('app')
	.controller("MainController", ['$scope', 'MainViewModel', function($scope, MainViewModel) {
		$scope.model = MainViewModel;
	}]);
})();