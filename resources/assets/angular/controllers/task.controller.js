(function() {
	angular
        .module('app')
    	.controller("TaskController", TaskController);

    TaskController.$inject = ["$scope", "$routeParams", "ApplicationState", "ProjectRepository", "TaskRepository"];

    function TaskController($scope, $routeParams, ApplicationState, ProjectRepository, TaskRepository) {
        var projectID = $routeParams.projectID;
        var taskID = $routeParams.taskID;
        $scope.projectID = projectID;
        $scope.taskID = taskID;

        ApplicationState.setContext('project');
        ApplicationState.setRightContext('task');
        ApplicationState.setActiveProject(projectID);
        ApplicationState.setActiveTask(taskID);
        ProjectRepository.find(projectID, ApplicationState);
        TaskRepository.find(taskID, ApplicationState);
    }
})();