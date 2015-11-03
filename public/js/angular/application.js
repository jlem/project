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
            setContext: setContext,
            getContext: getContext,
            setRightContext: setRightContext,
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
        function setContext(context) {
            state.context = context;
        }

        function getContext() {
            return state.context;
        }

        function setRightContext(context) {
            state.rightContext = context;
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

        ApplicationState.setContext('project');
        ApplicationState.setRightContext('project');

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

        ApplicationState.setContext('project');
        ApplicationState.setRightContext('task');

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

        function authUser(model) {
            $http.get('/user/tasks').success(success);
        }
    }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic3RhdGUuanMiLCJjb250cm9sbGVycy9tYWluLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zaWRlYmFyLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90YXNrLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL215LXRhc2stbGlzdC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtZGV0YWlscy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtdGFza3MuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWxpbmsuZGlyZWN0aXZlLmpzIiwicmVwb3NpdG9yaWVzL3Byb2plY3QucmVwb3NpdG9yeS5qcyIsInJlcG9zaXRvcmllcy90YXNrLnJlcG9zaXRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pXG5cdCAgICAuY29uZmlnKGNvbmZpZyk7XG5cbiAgICBjb25maWcuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIGNvbmZpZygkcm91dGVQcm92aWRlcikge1xuICAgICAgICAkcm91dGVQcm92aWRlclxuICAgICAgICAgICAgLndoZW4oJy9wcm9qZWN0Lzpwcm9qZWN0SUQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RDb250cm9sbGVyJ1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC53aGVuKCcvcHJvamVjdC86cHJvamVjdElEL3Rhc2svOnRhc2tJRCcsIHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy90YXNrLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYXNrQ29udHJvbGxlcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0FwcGxpY2F0aW9uU3RhdGUnLCBBcHBsaWNhdGlvblN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIEFwcGxpY2F0aW9uU3RhdGUoKSB7XG5cbiAgICAgICAgLy8gUHJpdmF0ZSBTdGF0ZVxuICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICBjb250ZXh0OiBcImhvbWVcIixcbiAgICAgICAgICAgIHJpZ2h0Q29udGV4dDogXCJob21lXCIsXG4gICAgICAgICAgICBjdXJyZW50UHJvamVjdDoge30sXG4gICAgICAgICAgICBjdXJyZW50VGFzazoge30sXG4gICAgICAgICAgICBhbGxQcm9qZWN0czogW10sXG4gICAgICAgICAgICBhdXRoVXNlclByb2plY3RzOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAvLyBDb250ZXh0XG4gICAgICAgICAgICBzZXRDb250ZXh0OiBzZXRDb250ZXh0LFxuICAgICAgICAgICAgZ2V0Q29udGV4dDogZ2V0Q29udGV4dCxcbiAgICAgICAgICAgIHNldFJpZ2h0Q29udGV4dDogc2V0UmlnaHRDb250ZXh0LFxuICAgICAgICAgICAgZ2V0UmlnaHRDb250ZXh0OiBnZXRSaWdodENvbnRleHQsXG5cbiAgICAgICAgICAgIC8vIFByb2plY3RzXG4gICAgICAgICAgICBpc0FjdGl2ZVByb2plY3Q6IGlzQWN0aXZlUHJvamVjdCxcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9qZWN0OiBzZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGdldEN1cnJlbnRQcm9qZWN0OiBnZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIHNldEFsbFByb2plY3RzOiBzZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIGdldEFsbFByb2plY3RzOiBnZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIHNldEF1dGhVc2VyUHJvamVjdHM6IHNldEF1dGhVc2VyUHJvamVjdHMsXG4gICAgICAgICAgICBnZXRBdXRoVXNlclByb2plY3RzOiBnZXRBdXRoVXNlclByb2plY3RzLFxuXG4gICAgICAgICAgICAvLyBUYXNrc1xuICAgICAgICAgICAgaXNBY3RpdmVUYXNrOiBpc0FjdGl2ZVRhc2ssXG4gICAgICAgICAgICBnZXRDdXJyZW50VGFzazogZ2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBzZXRDdXJyZW50VGFzazogc2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBnZXRUYXNrTGluazogZ2V0VGFza0xpbmtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBzZXRDb250ZXh0KGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN0YXRlLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0UmlnaHRDb250ZXh0KGNvbnRleHQpIHtcbiAgICAgICAgICAgIHN0YXRlLnJpZ2h0Q29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRSaWdodENvbnRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUucmlnaHRDb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNBY3RpdmVQcm9qZWN0KGluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50UHJvamVjdCgpLmlkID09IGluZGV4ICYmIHRoaXMuZ2V0Q29udGV4dCgpID09IFwicHJvamVjdFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFByb2plY3QocHJvamVjdCkge1xuICAgICAgICAgICAgc3RhdGUuY3VycmVudFByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY3VycmVudFByb2plY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRBbGxQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYWxsUHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbFByb2plY3RzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFsbFByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFRhc2soY3VycmVudFRhc2spIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRUYXNrID0gY3VycmVudFRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDdXJyZW50VGFzaygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jdXJyZW50VGFzaztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlVGFzayhpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudFRhc2soKS5pZCA9PSBpbmRleCAmJiB0aGlzLmdldFJpZ2h0Q29udGV4dCgpID09IFwidGFza1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QXV0aFVzZXJQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYXV0aFVzZXJQcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXV0aFVzZXJQcm9qZWN0cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hdXRoVXNlclByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGFza0xpbmsodGFzaykge1xuICAgICAgICAgICAgdmFyIHVybCA9ICcjL3Byb2plY3QvJyt0YXNrLnByb2plY3RfaWQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmVUYXNrKHRhc2suaWQpKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsKycvdGFzay8nK3Rhc2suaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5jb250cm9sbGVyKFwiTWFpbkNvbnRyb2xsZXJcIiwgTWFpbkNvbnRyb2xsZXIpO1xuXG4gICAgTWFpbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnQXBwbGljYXRpb25TdGF0ZSddO1xuXG4gICAgZnVuY3Rpb24gTWFpbkNvbnRyb2xsZXIoQXBwbGljYXRpb25TdGF0ZSkge1xuICAgICAgICB0aGlzLnZtID0gQXBwbGljYXRpb25TdGF0ZTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmNvbnRyb2xsZXIoXCJQcm9qZWN0Q29udHJvbGxlclwiLCBQcm9qZWN0Q29udHJvbGxlcik7XG5cbiAgICBQcm9qZWN0Q29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHJvdXRlUGFyYW1zXCIsIFwiQXBwbGljYXRpb25TdGF0ZVwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCJdO1xuXG4gICAgZnVuY3Rpb24gUHJvamVjdENvbnRyb2xsZXIoJHJvdXRlUGFyYW1zLCBBcHBsaWNhdGlvblN0YXRlLCBQcm9qZWN0UmVwb3NpdG9yeSkge1xuICAgICAgICB2YXIgcHJvamVjdElEID0gJHJvdXRlUGFyYW1zLnByb2plY3RJRDtcblxuICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldENvbnRleHQoJ3Byb2plY3QnKTtcbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRSaWdodENvbnRleHQoJ3Byb2plY3QnKTtcblxuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5maW5kKHByb2plY3RJRCwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldEN1cnJlbnRQcm9qZWN0KHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIlNpZGViYXJDb250cm9sbGVyXCIsIFNpZGViYXJDb250cm9sbGVyKTtcblxuICAgIFNpZGViYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdQcm9qZWN0UmVwb3NpdG9yeScsICdBcHBsaWNhdGlvblN0YXRlJ107XG5cbiAgICBmdW5jdGlvbiBTaWRlYmFyQ29udHJvbGxlcigkc2NvcGUsIFByb2plY3RSZXBvc2l0b3J5LCBBcHBsaWNhdGlvblN0YXRlKSB7XG4gICAgICAgIFxuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5hbGwoZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldEFsbFByb2plY3RzKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFByb2plY3RSZXBvc2l0b3J5LmF1dGhVc2VyKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRBdXRoVXNlclByb2plY3RzKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICBcdC5jb250cm9sbGVyKFwiVGFza0NvbnRyb2xsZXJcIiwgVGFza0NvbnRyb2xsZXIpO1xuXG4gICAgVGFza0NvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIkFwcGxpY2F0aW9uU3RhdGVcIiwgXCJQcm9qZWN0UmVwb3NpdG9yeVwiLCBcIlRhc2tSZXBvc2l0b3J5XCJdO1xuXG4gICAgZnVuY3Rpb24gVGFza0NvbnRyb2xsZXIoJHNjb3BlLCAkcm91dGVQYXJhbXMsIEFwcGxpY2F0aW9uU3RhdGUsIFByb2plY3RSZXBvc2l0b3J5LCBUYXNrUmVwb3NpdG9yeSkge1xuICAgICAgICB2YXIgcHJvamVjdElEID0gJHJvdXRlUGFyYW1zLnByb2plY3RJRDtcbiAgICAgICAgdmFyIHRhc2tJRCA9ICRyb3V0ZVBhcmFtcy50YXNrSUQ7XG5cbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDb250ZXh0KCdwcm9qZWN0Jyk7XG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0UmlnaHRDb250ZXh0KCd0YXNrJyk7XG5cbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDdXJyZW50UHJvamVjdChyZXN1bHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBUYXNrUmVwb3NpdG9yeS5maW5kKHRhc2tJRCwgZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldEN1cnJlbnRUYXNrKHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJteVRhc2tMaXN0XCIsIG15VGFza0xpc3QpO1xuXG4gICAgbXlUYXNrTGlzdC4kaW5qZWN0ID0gWyckaHR0cCddO1xuXG4gICAgZnVuY3Rpb24gbXlUYXNrTGlzdCgkaHR0cCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvbXktdGFzay1saXN0Lmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJGh0dHApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhc2tzID0gW107XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICRodHRwLmdldCgnL3VzZXIvdGFza3MnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50YXNrcyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbXRsJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJwcm9qZWN0RGV0YWlsc1wiLCBwcm9qZWN0RGV0YWlscyk7XG5cbiAgICBmdW5jdGlvbiBwcm9qZWN0RGV0YWlscygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3QtZGV0YWlscy5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuZGlyZWN0aXZlKFwicHJvamVjdFRhc2tzXCIsIHByb2plY3RUYXNrcyk7XG5cbiAgICBmdW5jdGlvbiBwcm9qZWN0VGFza3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9wcm9qZWN0LXRhc2tzLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwidGFza0RldGFpbHNcIiwgdGFza0RldGFpbHMpO1xuXG4gICAgZnVuY3Rpb24gdGFza0RldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy90YXNrLWRldGFpbHMuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwidGFza0xpbmtcIiwgdGFza0xpbmspO1xuXG4gICAgZnVuY3Rpb24gdGFza0xpbmsoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy90YXNrLWxpbmsuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLnNlcnZpY2UoJ1Byb2plY3RSZXBvc2l0b3J5JywgUHJvamVjdFJlcG9zaXRvcnkpO1xuXG4gICAgUHJvamVjdFJlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RSZXBvc2l0b3J5KCRodHRwKSB7XG5cbiAgICAgICAgLy8gQVBJXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGZpbmQ6IGZpbmQsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdCcpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKGlkLCBzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdXRoVXNlcihzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Byb2plY3RzJykuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5zZXJ2aWNlKCdUYXNrUmVwb3NpdG9yeScsIFRhc2tSZXBvc2l0b3J5KTtcblxuICAgIFRhc2tSZXBvc2l0b3J5LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBUYXNrUmVwb3NpdG9yeSgkaHR0cCkge1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICAgICAgYnlQcm9qZWN0OiBieVByb2plY3QsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzaycpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKHRhc2tJRCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzay8nK3Rhc2tJRCkuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ5UHJvamVjdChpZCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdC8nK2lkKycvdGFza3MnKS5zdWNjZXNzKHN1Y2Nlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXV0aFVzZXIobW9kZWwpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3VzZXIvdGFza3MnKS5zdWNjZXNzKHN1Y2Nlc3MpO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=