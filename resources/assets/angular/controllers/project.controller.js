(function() {
	angular
        .module('app')
	    .controller("ProjectController", ProjectController);

    ProjectController.$inject = ["$routeParams", "ApplicationState", "ProjectRepository"];

    function ProjectController($routeParams, ApplicationState, ProjectRepository) {
        var projectID = $routeParams.projectID;

        ApplicationState.setContext('project');
        ApplicationState.setRightContext('project');

        ProjectRepository.find(projectID, function(result) {
            ApplicationState.setCurrentProject(result);
        });
    }
})();