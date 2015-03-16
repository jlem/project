(function() {
	angular.module('app')
	.controller("ProjectController", ["$scope", "$routeParams", "MainViewModel", "ProjectRepository", function($scope, $routeParams, MainViewModel, ProjectRepository) {
		var projectID = $routeParams.projectID;
		$scope.projectID = projectID;
		MainViewModel.setContext('project');
		MainViewModel.setRightContext('project');
		MainViewModel.setActiveProject(projectID);
		ProjectRepository.find(projectID, MainViewModel);
	}]);
})();