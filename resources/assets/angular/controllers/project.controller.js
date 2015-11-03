(function() {
	angular
        .module('app')
	    .controller("ProjectController", ProjectController);

    ProjectController.$inject = ["$scope", "$routeParams", "ApplicationState", "ProjectRepository"];

    function ProjectController($scope, $routeParams, ApplicationState, ProjectRepository) {
        var projectID = $routeParams.projectID;
        $scope.projectID = projectID;
        ApplicationState.setContext('project');
        ApplicationState.setRightContext('project');
        ApplicationState.setActiveProject(projectID);
        ProjectRepository.find(projectID, ApplicationState);
    }
})();