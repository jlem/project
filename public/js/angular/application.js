(function() {
	angular
        .module('app', ['ngRoute'])
	    .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/project/:projectID', {
                templateUrl: '/partials/projects.html',
                controller: 'ProjectController'
            })
            .when('/project/:projectID/task/:taskID', {
                templateUrl: '/partials/task.html',
                controller: 'TaskController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();
(function() {
    angular
        .module('app')
        .factory('ApplicationState', ApplicationState);

    function ApplicationState() {

        // Private State
        var state = {
            context: "home",
            rightContext: "home",
            currentProject: {},
            currentTask: {},
            allProjects: [],
            authUserProjects: []
        };

        // API
        return {

            // Context
            changeToProjectContext: changeToProjectContext,
            changeToTaskContext: changeToTaskContext,
            getContext: getContext,
            getRightContext: getRightContext,

            // Projects
            isActiveProject: isActiveProject,
            setCurrentProject: setCurrentProject,
            getCurrentProject: getCurrentProject,
            setAllProjects: setAllProjects,
            getAllProjects: getAllProjects,
            setAuthUserProjects: setAuthUserProjects,
            getAuthUserProjects: getAuthUserProjects,

            // Tasks
            isActiveTask: isActiveTask,
            getCurrentTask: getCurrentTask,
            setCurrentTask: setCurrentTask,
            getTaskLink: getTaskLink
        };

        // Implementation
        function changeToProjectContext() {
            state.context = 'project';
            state.rightContext = 'project';
        }

        function changeToTaskContext() {
            state.context = 'project';
            state.rightContext = 'task';
        }

        function getContext() {
            return state.context;
        }

        function getRightContext() {
            return state.rightContext;
        }

        function isActiveProject(index) {
            return this.getCurrentProject().id == index && this.getContext() == "project";
        }

        function setCurrentProject(project) {
            state.currentProject = project;
        }

        function getCurrentProject() {
            return state.currentProject;
        }

        function setAllProjects(projects) {
            state.allProjects = projects;
        }

        function getAllProjects() {
            return state.allProjects;
        }

        function setCurrentTask(currentTask) {
            state.currentTask = currentTask;
        }

        function getCurrentTask() {
            return state.currentTask;
        }

        function isActiveTask(index) {
            return this.getCurrentTask().id == index && this.getRightContext() == "task";
        }

        function setAuthUserProjects(projects) {
            state.authUserProjects = projects;
        }

        function getAuthUserProjects() {
            return state.authUserProjects;
        }

        function getTaskLink(task) {
            var url = '#/project/'+task.project_id;
            if (!this.isActiveTask(task.id)) {
                url = url+'/task/'+task.id;
            }
            return url;
        }
    }
})();
(function() {
	angular
        .module('app')
        .directive("myTaskList", myTaskList);

    myTaskList.$inject = ['$http'];

    function myTaskList($http) {
        return {
            restrict: "E",
            templateUrl: '/partials/my-task-list.html',
            controller: function($http) {
                this.tasks = [];
                var self = this;
                $http.get('/user/tasks').success(function(data) {
                    self.tasks = data;
                });
            },
            controllerAs: 'mtl'
        };
    }
})();
(function() {
	angular
        .module('app')
        .directive("projectDetails", projectDetails);

    function projectDetails() {
        return {
            restrict: "E",
            templateUrl: '/partials/project-details.html'
        };
    }
})();
(function() {
	angular
        .module('app')
	    .directive("projectTasks", projectTasks);

    function projectTasks() {
        return {
            restrict: "E",
            templateUrl: '/partials/project-tasks.html'
        };
    }

})();
(function() {
	angular
        .module('app')
        .directive("taskDetails", taskDetails);

    function taskDetails() {
        return {
            restrict: "E",
            templateUrl: '/partials/task-details.html'
        };
    }
})();
(function() {
	angular
        .module('app')
        .directive("taskLink", taskLink);

    function taskLink() {
        return {
            restrict: "E",
            templateUrl: '/partials/task-link.html'
        };
    }
})();
(function() {
	angular
        .module('app')
	    .controller("MainController", MainController);

    MainController.$inject = ['ApplicationState'];

    function MainController(ApplicationState) {
        this.vm = ApplicationState;
    }
})();
(function() {
	angular
        .module('app')
	    .controller("ProjectController", ProjectController);

    ProjectController.$inject = ["$routeParams", "ApplicationState", "ProjectRepository"];

    function ProjectController($routeParams, ApplicationState, ProjectRepository) {
        var projectID = $routeParams.projectID;

        ApplicationState.changeToProjectContext();

        ProjectRepository.find(projectID, function(result) {
            ApplicationState.setCurrentProject(result);
        });
    }
})();
(function() {
	angular
        .module('app')
	    .controller("SidebarController", SidebarController);

    SidebarController.$inject = ['$scope', 'ProjectRepository', 'ApplicationState'];

    function SidebarController($scope, ProjectRepository, ApplicationState) {
        
        ProjectRepository.all(function(result) {
            ApplicationState.setAllProjects(result);
        });

        ProjectRepository.authUser(function(result) {
            ApplicationState.setAuthUserProjects(result);
        });
    }
})();

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
(function() {
	angular
        .module('app')
	    .service('ProjectRepository', ProjectRepository);

    ProjectRepository.$inject = ['$http'];

    function ProjectRepository($http) {

        // API
        return {
            all: all,
            find: find,
            authUser: authUser
        };

        // Implementation
        function all(success) {
            $http.get('/project').success(success);
        }

        function find(id, success) {
            $http.get('/project/'+id).success(success);
        }

        function authUser(success) {
            $http.get('/user/projects').success(success);
        }
    }

})();
(function() {
	angular
        .module('app')
	    .service('TaskRepository', TaskRepository);

    TaskRepository.$inject = ['$http'];

    function TaskRepository($http) {

        // API
        return {
            all: all,
            find: find,
            byProject: byProject,
            authUser: authUser
        };

        // Implementation
        function all(success) {
            $http.get('/task').success(success);
        }

        function find(taskID, success) {
            $http.get('/task/'+taskID).success(success);
        }

        function byProject(id, success) {
            $http.get('/project/'+id+'/tasks').success(success);
        }

        function authUser(success) {
            $http.get('/user/tasks').success(success);
        }
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic3RhdGUuanMiLCJkaXJlY3RpdmVzL215LXRhc2stbGlzdC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtZGV0YWlscy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtdGFza3MuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWxpbmsuZGlyZWN0aXZlLmpzIiwiY29udHJvbGxlcnMvbWFpbi5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcHJvamVjdC5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2lkZWJhci5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvdGFzay5jb250cm9sbGVyLmpzIiwicmVwb3NpdG9yaWVzL3Byb2plY3QucmVwb3NpdG9yeS5qcyIsInJlcG9zaXRvcmllcy90YXNrLnJlcG9zaXRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pXG5cdCAgICAuY29uZmlnKGNvbmZpZyk7XG5cbiAgICBjb25maWcuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZygkcm91dGVQcm92aWRlcikge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oJy9wcm9qZWN0Lzpwcm9qZWN0SUQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvcHJvamVjdC86cHJvamVjdElEL3Rhc2svOnRhc2tJRCcsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy90YXNrLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYXNrQ29udHJvbGxlcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0FwcGxpY2F0aW9uU3RhdGUnLCBBcHBsaWNhdGlvblN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIEFwcGxpY2F0aW9uU3RhdGUoKSB7XG5cbiAgICAgICAgLy8gUHJpdmF0ZSBTdGF0ZVxuICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICBjb250ZXh0OiBcImhvbWVcIixcbiAgICAgICAgICAgIHJpZ2h0Q29udGV4dDogXCJob21lXCIsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdDoge30sXG4gICAgICAgICAgICBjdXJyZW50VGFzazoge30sXG4gICAgICAgICAgICBhbGxQcm9qZWN0czogW10sXG4gICAgICAgICAgICBhdXRoVXNlclByb2plY3RzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAvLyBDb250ZXh0XG4gICAgICAgICAgICBjaGFuZ2VUb1Byb2plY3RDb250ZXh0OiBjaGFuZ2VUb1Byb2plY3RDb250ZXh0LFxuICAgICAgICAgICAgY2hhbmdlVG9UYXNrQ29udGV4dDogY2hhbmdlVG9UYXNrQ29udGV4dCxcbiAgICAgICAgICAgIGdldENvbnRleHQ6IGdldENvbnRleHQsXG4gICAgICAgICAgICBnZXRSaWdodENvbnRleHQ6IGdldFJpZ2h0Q29udGV4dCxcblxuICAgICAgICAgICAgLy8gUHJvamVjdHNcbiAgICAgICAgICAgIGlzQWN0aXZlUHJvamVjdDogaXNBY3RpdmVQcm9qZWN0LFxuICAgICAgICAgICAgc2V0Q3VycmVudFByb2plY3Q6IHNldEN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgZ2V0Q3VycmVudFByb2plY3Q6IGdldEN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgc2V0QWxsUHJvamVjdHM6IHNldEFsbFByb2plY3RzLFxuICAgICAgICAgICAgZ2V0QWxsUHJvamVjdHM6IGdldEFsbFByb2plY3RzLFxuICAgICAgICAgICAgc2V0QXV0aFVzZXJQcm9qZWN0czogc2V0QXV0aFVzZXJQcm9qZWN0cyxcbiAgICAgICAgICAgIGdldEF1dGhVc2VyUHJvamVjdHM6IGdldEF1dGhVc2VyUHJvamVjdHMsXG5cbiAgICAgICAgICAgIC8vIFRhc2tzXG4gICAgICAgICAgICBpc0FjdGl2ZVRhc2s6IGlzQWN0aXZlVGFzayxcbiAgICAgICAgICAgIGdldEN1cnJlbnRUYXNrOiBnZXRDdXJyZW50VGFzayxcbiAgICAgICAgICAgIHNldEN1cnJlbnRUYXNrOiBzZXRDdXJyZW50VGFzayxcbiAgICAgICAgICAgIGdldFRhc2tMaW5rOiBnZXRUYXNrTGlua1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEltcGxlbWVudGF0aW9uXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVRvUHJvamVjdENvbnRleHQoKSB7XG4gICAgICAgICAgICBzdGF0ZS5jb250ZXh0ID0gJ3Byb2plY3QnO1xuICAgICAgICAgICAgc3RhdGUucmlnaHRDb250ZXh0ID0gJ3Byb2plY3QnO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlVG9UYXNrQ29udGV4dCgpIHtcbiAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgPSAncHJvamVjdCc7XG4gICAgICAgICAgICBzdGF0ZS5yaWdodENvbnRleHQgPSAndGFzayc7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmNvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSaWdodENvbnRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUucmlnaHRDb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBY3RpdmVQcm9qZWN0KGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50UHJvamVjdCgpLmlkID09IGluZGV4ICYmIHRoaXMuZ2V0Q29udGV4dCgpID09IFwicHJvamVjdFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFByb2plY3QocHJvamVjdCkge1xuICAgICAgICAgICAgc3RhdGUuY3VycmVudFByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY3VycmVudFByb2plY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRBbGxQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYWxsUHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbFByb2plY3RzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFsbFByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFRhc2soY3VycmVudFRhc2spIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRUYXNrID0gY3VycmVudFRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDdXJyZW50VGFzaygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jdXJyZW50VGFzaztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlVGFzayhpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudFRhc2soKS5pZCA9PSBpbmRleCAmJiB0aGlzLmdldFJpZ2h0Q29udGV4dCgpID09IFwidGFza1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QXV0aFVzZXJQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYXV0aFVzZXJQcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXV0aFVzZXJQcm9qZWN0cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hdXRoVXNlclByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGFza0xpbmsodGFzaykge1xuICAgICAgICAgICAgdmFyIHVybCA9ICcjL3Byb2plY3QvJyt0YXNrLnByb2plY3RfaWQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmVUYXNrKHRhc2suaWQpKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsKycvdGFzay8nK3Rhc2suaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcIm15VGFza0xpc3RcIiwgbXlUYXNrTGlzdCk7XG5cbiAgICBteVRhc2tMaXN0LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBteVRhc2tMaXN0KCRodHRwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9teS10YXNrLWxpc3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlci90YXNrcycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnRhc2tzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtdGwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInByb2plY3REZXRhaWxzXCIsIHByb2plY3REZXRhaWxzKTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3REZXRhaWxzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdC1kZXRhaWxzLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5kaXJlY3RpdmUoXCJwcm9qZWN0VGFza3NcIiwgcHJvamVjdFRhc2tzKTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3RUYXNrcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3QtdGFza3MuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJ0YXNrRGV0YWlsc1wiLCB0YXNrRGV0YWlscyk7XG5cbiAgICBmdW5jdGlvbiB0YXNrRGV0YWlscygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Rhc2stZGV0YWlscy5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJ0YXNrTGlua1wiLCB0YXNrTGluayk7XG5cbiAgICBmdW5jdGlvbiB0YXNrTGluaygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Rhc2stbGluay5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIk1haW5Db250cm9sbGVyXCIsIE1haW5Db250cm9sbGVyKTtcblxuICAgIE1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0FwcGxpY2F0aW9uU3RhdGUnXTtcblxuICAgIGZ1bmN0aW9uIE1haW5Db250cm9sbGVyKEFwcGxpY2F0aW9uU3RhdGUpIHtcbiAgICAgICAgdGhpcy52bSA9IEFwcGxpY2F0aW9uU3RhdGU7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5jb250cm9sbGVyKFwiUHJvamVjdENvbnRyb2xsZXJcIiwgUHJvamVjdENvbnRyb2xsZXIpO1xuXG4gICAgUHJvamVjdENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRyb3V0ZVBhcmFtc1wiLCBcIkFwcGxpY2F0aW9uU3RhdGVcIiwgXCJQcm9qZWN0UmVwb3NpdG9yeVwiXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RDb250cm9sbGVyKCRyb3V0ZVBhcmFtcywgQXBwbGljYXRpb25TdGF0ZSwgUHJvamVjdFJlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG5cbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5jaGFuZ2VUb1Byb2plY3RDb250ZXh0KCk7XG5cbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDdXJyZW50UHJvamVjdChyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmNvbnRyb2xsZXIoXCJTaWRlYmFyQ29udHJvbGxlclwiLCBTaWRlYmFyQ29udHJvbGxlcik7XG5cbiAgICBTaWRlYmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnUHJvamVjdFJlcG9zaXRvcnknLCAnQXBwbGljYXRpb25TdGF0ZSddO1xuXG4gICAgZnVuY3Rpb24gU2lkZWJhckNvbnRyb2xsZXIoJHNjb3BlLCBQcm9qZWN0UmVwb3NpdG9yeSwgQXBwbGljYXRpb25TdGF0ZSkge1xuICAgICAgICBcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuYWxsKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRBbGxQcm9qZWN0cyhyZXN1bHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5hdXRoVXNlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0QXV0aFVzZXJQcm9qZWN0cyhyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgXHQuY29udHJvbGxlcihcIlRhc2tDb250cm9sbGVyXCIsIFRhc2tDb250cm9sbGVyKTtcblxuICAgIFRhc2tDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCJBcHBsaWNhdGlvblN0YXRlXCIsIFwiUHJvamVjdFJlcG9zaXRvcnlcIiwgXCJUYXNrUmVwb3NpdG9yeVwiXTtcblxuICAgIGZ1bmN0aW9uIFRhc2tDb250cm9sbGVyKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBBcHBsaWNhdGlvblN0YXRlLCBQcm9qZWN0UmVwb3NpdG9yeSwgVGFza1JlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG4gICAgICAgIHZhciB0YXNrSUQgPSAkcm91dGVQYXJhbXMudGFza0lEO1xuXG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuY2hhbmdlVG9UYXNrQ29udGV4dCgpO1xuXG4gICAgICAgIFByb2plY3RSZXBvc2l0b3J5LmZpbmQocHJvamVjdElELCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0Q3VycmVudFByb2plY3QocmVzdWx0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGFza1JlcG9zaXRvcnkuZmluZCh0YXNrSUQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDdXJyZW50VGFzayhyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLnNlcnZpY2UoJ1Byb2plY3RSZXBvc2l0b3J5JywgUHJvamVjdFJlcG9zaXRvcnkpO1xuXG4gICAgUHJvamVjdFJlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RSZXBvc2l0b3J5KCRodHRwKSB7XG5cbiAgICAgICAgLy8gQVBJXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGZpbmQ6IGZpbmQsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdCcpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKGlkLCBzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdXRoVXNlcihzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Byb2plY3RzJykuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5zZXJ2aWNlKCdUYXNrUmVwb3NpdG9yeScsIFRhc2tSZXBvc2l0b3J5KTtcblxuICAgIFRhc2tSZXBvc2l0b3J5LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBUYXNrUmVwb3NpdG9yeSgkaHR0cCkge1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICAgICAgYnlQcm9qZWN0OiBieVByb2plY3QsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzaycpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKHRhc2tJRCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzay8nK3Rhc2tJRCkuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ5UHJvamVjdChpZCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdC8nK2lkKycvdGFza3MnKS5zdWNjZXNzKHN1Y2Nlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXV0aFVzZXIoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlci90YXNrcycpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==