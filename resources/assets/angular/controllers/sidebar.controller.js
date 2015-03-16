(function() {
	angular.module('app')
	.controller("SidebarController", ["$scope", "ProjectRepository", "MainViewModel", function($scope, ProjectRepository, MainViewModel) {
		ProjectRepository.all(MainViewModel);
	    ProjectRepository.authUser(MainViewModel);
	}]);
})();