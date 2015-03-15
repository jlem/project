(function() {
	angular.module('app', ['ngRoute'])
	.controller("SidebarController", ["$scope", "ProjectRepository", "SidebarViewModel", function($scope, ProjectRepository, SidebarViewModel) {
		$scope.model = SidebarViewModel;
		ProjectRepository.all($scope.model);
        ProjectRepository.authUser($scope.model);
	}]);
})();