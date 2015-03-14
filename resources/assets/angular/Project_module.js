(function() {
	angular.module('app', [])
	.controller("SidebarController", ["$scope", "ProjectRepository", "SidebarViewModel", function($scope, ProjectRepository, SidebarViewModel) {
		$scope.model = SidebarViewModel;
		ProjectRepository.all($scope.model);
	}]);
})();