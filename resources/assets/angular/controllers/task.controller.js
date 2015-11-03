(function() {
	angular
        .module('app')
    	.controller("TaskController", TaskController);

    TaskController.$inject = ["$scope", "$routeParams", "MainViewModel", "ProjectRepository", "TaskRepository"];

    function TaskController($scope, $routeParams, MainViewModel, ProjectRepository, TaskRepository) {
        var projectID = $routeParams.projectID;
        var taskID = $routeParams.taskID;
        $scope.projectID = projectID;
        $scope.taskID = taskID;

        MainViewModel.setContext('project');
        MainViewModel.setRightContext('task');
        MainViewModel.setActiveProject(projectID);
        MainViewModel.setActiveTask(taskID);
        ProjectRepository.find(projectID, MainViewModel);
        TaskRepository.find(taskID, MainViewModel);
    }
})();