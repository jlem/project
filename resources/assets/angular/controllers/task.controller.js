(function() {
	angular
        .module('app')
    	.controller("TaskController", TaskController);

    TaskController.$inject = ["$scope", "$routeParams", "ApplicationState", "ProjectRepository", "TaskRepository"];

    function TaskController($scope, $routeParams, ApplicationState, ProjectRepository, TaskRepository) {
        var projectID = $routeParams.projectID;
        var taskID = $routeParams.taskID;

        ApplicationState.changeToTaskContext();

        ProjectRepository.find(projectID, function(result) {
            ApplicationState.setCurrentProject(result);
        });

        TaskRepository.find(taskID, function(result) {
            ApplicationState.setCurrentTask(result);
        });
    }
})();