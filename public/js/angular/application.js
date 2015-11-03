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
            activeProject: null,
            currentTask: {},
            allProjects: [],
            authUserProjects: [],
            activeTask: null
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
            setActiveProject: setActiveProject,
            getActiveProject: getActiveProject,
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
            setActiveTask: setActiveTask,
            getActiveTask: getActiveTask,
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
            return this.getActiveProject() == index && this.getContext() == "project";
        }

        function setActiveProject(index) {
            state.activeProject = index;
        }

        function getActiveProject() {
            return state.activeProject;
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
            return this.getActiveTask() == index && this.getRightContext() == "task";
        }

        function setActiveTask(index) {
            state.activeTask = index;
        }

        function getActiveTask() {
            return state.activeTask;
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
(function() {
	angular
        .module('app')
	    .controller("SidebarController", SidebarController);

    SidebarController.$inject = ['$scope', 'ProjectRepository', 'ApplicationState'];

    function SidebarController($scope, ProjectRepository, ApplicationState) {
        ProjectRepository.all(ApplicationState);
        ProjectRepository.authUser(ApplicationState);
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
        function all(state) {
            $http.get('/project').success(function(data) {
                state.setAllProjects(data);
            });
        }

        function find(id, state) {
            $http.get('/project/'+id).success(function(data) {
                state.setCurrentProject(data);
            });
        }

        function authUser(state) {
            $http.get('/user/projects').success(function(data) {
                state.setAuthUserProjects(data);
            });
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
        function all(state) {
            $http.get('/task').success(function(data) {
                state.setAllProjects(data);
            });
        }

        function find(taskID, state) {
            $http.get('/task/'+taskID).success(function(data) {
                state.setCurrentTask(data);
            });
        }

        function byProject(id, state) {
            $http.get('/project/'+id+'/tasks').success(function(data) {
                state.tasks = data;
            });
        }

        function authUser(model) {
            $http.get('/user/tasks').success(function(data) {
                model.authUserTasks = data;
            });
        }
    }
})();
(function() {
	angular.module('app')
	.factory('SidebiewModel', function() {
		return {
            allProjects: [],
			authUserProjects: [],
            activeProject: null,
            isActiveProject: function(index) {
                return this.activeProject === index;
            },
            setActiveProject: function(index) {
                this.activeProject = index;
            }
		};
	});
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic3RhdGUuanMiLCJjb250cm9sbGVycy9tYWluLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zaWRlYmFyLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90YXNrLmNvbnRyb2xsZXIuanMiLCJkaXJlY3RpdmVzL215LXRhc2stbGlzdC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtZGV0YWlscy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtdGFza3MuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWxpbmsuZGlyZWN0aXZlLmpzIiwicmVwb3NpdG9yaWVzL3Byb2plY3QucmVwb3NpdG9yeS5qcyIsInJlcG9zaXRvcmllcy90YXNrLnJlcG9zaXRvcnkuanMiLCJ2aWV3X21vZGVscy9zaWRlYmFyLnZpZXdtb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKVxuXHQgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgY29uZmlnLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBjb25maWcoJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC53aGVuKCcvcHJvamVjdC86cHJvamVjdElEJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0Q29udHJvbGxlcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3Byb2plY3QvOnByb2plY3RJRC90YXNrLzp0YXNrSUQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGFza0NvbnRyb2xsZXInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBcHBsaWNhdGlvblN0YXRlJywgQXBwbGljYXRpb25TdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiBBcHBsaWNhdGlvblN0YXRlKCkge1xuXG4gICAgICAgIC8vIFByaXZhdGUgU3RhdGVcbiAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgY29udGV4dDogXCJob21lXCIsXG4gICAgICAgICAgICByaWdodENvbnRleHQ6IFwiaG9tZVwiLFxuICAgICAgICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgICAgICAgYWN0aXZlUHJvamVjdDogbnVsbCxcbiAgICAgICAgICAgIGN1cnJlbnRUYXNrOiB7fSxcbiAgICAgICAgICAgIGFsbFByb2plY3RzOiBbXSxcbiAgICAgICAgICAgIGF1dGhVc2VyUHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgYWN0aXZlVGFzazogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgICAgICAvLyBDb250ZXh0XG4gICAgICAgICAgICBzZXRDb250ZXh0OiBzZXRDb250ZXh0LFxuICAgICAgICAgICAgZ2V0Q29udGV4dDogZ2V0Q29udGV4dCxcbiAgICAgICAgICAgIHNldFJpZ2h0Q29udGV4dDogc2V0UmlnaHRDb250ZXh0LFxuICAgICAgICAgICAgZ2V0UmlnaHRDb250ZXh0OiBnZXRSaWdodENvbnRleHQsXG5cbiAgICAgICAgICAgIC8vIFByb2plY3RzXG4gICAgICAgICAgICBpc0FjdGl2ZVByb2plY3Q6IGlzQWN0aXZlUHJvamVjdCxcbiAgICAgICAgICAgIHNldEFjdGl2ZVByb2plY3Q6IHNldEFjdGl2ZVByb2plY3QsXG4gICAgICAgICAgICBnZXRBY3RpdmVQcm9qZWN0OiBnZXRBY3RpdmVQcm9qZWN0LFxuICAgICAgICAgICAgc2V0Q3VycmVudFByb2plY3Q6IHNldEN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgZ2V0Q3VycmVudFByb2plY3Q6IGdldEN1cnJlbnRQcm9qZWN0LFxuICAgICAgICAgICAgc2V0QWxsUHJvamVjdHM6IHNldEFsbFByb2plY3RzLFxuICAgICAgICAgICAgZ2V0QWxsUHJvamVjdHM6IGdldEFsbFByb2plY3RzLFxuICAgICAgICAgICAgc2V0QXV0aFVzZXJQcm9qZWN0czogc2V0QXV0aFVzZXJQcm9qZWN0cyxcbiAgICAgICAgICAgIGdldEF1dGhVc2VyUHJvamVjdHM6IGdldEF1dGhVc2VyUHJvamVjdHMsXG5cbiAgICAgICAgICAgIC8vIFRhc2tzXG4gICAgICAgICAgICBpc0FjdGl2ZVRhc2s6IGlzQWN0aXZlVGFzayxcbiAgICAgICAgICAgIGdldEN1cnJlbnRUYXNrOiBnZXRDdXJyZW50VGFzayxcbiAgICAgICAgICAgIHNldEN1cnJlbnRUYXNrOiBzZXRDdXJyZW50VGFzayxcbiAgICAgICAgICAgIHNldEFjdGl2ZVRhc2s6IHNldEFjdGl2ZVRhc2ssXG4gICAgICAgICAgICBnZXRBY3RpdmVUYXNrOiBnZXRBY3RpdmVUYXNrLFxuICAgICAgICAgICAgZ2V0VGFza0xpbms6IGdldFRhc2tMaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW1wbGVtZW50YXRpb25cbiAgICAgICAgZnVuY3Rpb24gc2V0Q29udGV4dChjb250ZXh0KSB7XG4gICAgICAgICAgICBzdGF0ZS5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY29udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFJpZ2h0Q29udGV4dChjb250ZXh0KSB7XG4gICAgICAgICAgICBzdGF0ZS5yaWdodENvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmlnaHRDb250ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnJpZ2h0Q29udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlUHJvamVjdChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlUHJvamVjdCgpID09IGluZGV4ICYmIHRoaXMuZ2V0Q29udGV4dCgpID09IFwicHJvamVjdFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0aXZlUHJvamVjdChpbmRleCkge1xuICAgICAgICAgICAgc3RhdGUuYWN0aXZlUHJvamVjdCA9IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWN0aXZlUHJvamVjdCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hY3RpdmVQcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFByb2plY3QocHJvamVjdCkge1xuICAgICAgICAgICAgc3RhdGUuY3VycmVudFByb2plY3QgPSBwcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY3VycmVudFByb2plY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRBbGxQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYWxsUHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFsbFByb2plY3RzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFsbFByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Q3VycmVudFRhc2soY3VycmVudFRhc2spIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRUYXNrID0gY3VycmVudFRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDdXJyZW50VGFzaygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jdXJyZW50VGFzaztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlVGFzayhpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QWN0aXZlVGFzaygpID09IGluZGV4ICYmIHRoaXMuZ2V0UmlnaHRDb250ZXh0KCkgPT0gXCJ0YXNrXCI7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRBY3RpdmVUYXNrKGluZGV4KSB7XG4gICAgICAgICAgICBzdGF0ZS5hY3RpdmVUYXNrID0gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBY3RpdmVUYXNrKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmFjdGl2ZVRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRBdXRoVXNlclByb2plY3RzKHByb2plY3RzKSB7XG4gICAgICAgICAgICBzdGF0ZS5hdXRoVXNlclByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBdXRoVXNlclByb2plY3RzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmF1dGhVc2VyUHJvamVjdHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRUYXNrTGluayh0YXNrKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gJyMvcHJvamVjdC8nK3Rhc2sucHJvamVjdF9pZDtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0FjdGl2ZVRhc2sodGFzay5pZCkpIHtcbiAgICAgICAgICAgICAgICB1cmwgPSB1cmwrJy90YXNrLycrdGFzay5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1cmw7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmNvbnRyb2xsZXIoXCJNYWluQ29udHJvbGxlclwiLCBNYWluQ29udHJvbGxlcik7XG5cbiAgICBNYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWydBcHBsaWNhdGlvblN0YXRlJ107XG5cbiAgICBmdW5jdGlvbiBNYWluQ29udHJvbGxlcihBcHBsaWNhdGlvblN0YXRlKSB7XG4gICAgICAgIHRoaXMudm0gPSBBcHBsaWNhdGlvblN0YXRlO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIlByb2plY3RDb250cm9sbGVyXCIsIFByb2plY3RDb250cm9sbGVyKTtcblxuICAgIFByb2plY3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCJBcHBsaWNhdGlvblN0YXRlXCIsIFwiUHJvamVjdFJlcG9zaXRvcnlcIl07XG5cbiAgICBmdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcigkc2NvcGUsICRyb3V0ZVBhcmFtcywgQXBwbGljYXRpb25TdGF0ZSwgUHJvamVjdFJlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG4gICAgICAgICRzY29wZS5wcm9qZWN0SUQgPSBwcm9qZWN0SUQ7XG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0Q29udGV4dCgncHJvamVjdCcpO1xuICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldFJpZ2h0Q29udGV4dCgncHJvamVjdCcpO1xuICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldEFjdGl2ZVByb2plY3QocHJvamVjdElEKTtcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIEFwcGxpY2F0aW9uU3RhdGUpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIlNpZGViYXJDb250cm9sbGVyXCIsIFNpZGViYXJDb250cm9sbGVyKTtcblxuICAgIFNpZGViYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdQcm9qZWN0UmVwb3NpdG9yeScsICdBcHBsaWNhdGlvblN0YXRlJ107XG5cbiAgICBmdW5jdGlvbiBTaWRlYmFyQ29udHJvbGxlcigkc2NvcGUsIFByb2plY3RSZXBvc2l0b3J5LCBBcHBsaWNhdGlvblN0YXRlKSB7XG4gICAgICAgIFByb2plY3RSZXBvc2l0b3J5LmFsbChBcHBsaWNhdGlvblN0YXRlKTtcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuYXV0aFVzZXIoQXBwbGljYXRpb25TdGF0ZSk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgIFx0LmNvbnRyb2xsZXIoXCJUYXNrQ29udHJvbGxlclwiLCBUYXNrQ29udHJvbGxlcik7XG5cbiAgICBUYXNrQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiQXBwbGljYXRpb25TdGF0ZVwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCIsIFwiVGFza1JlcG9zaXRvcnlcIl07XG5cbiAgICBmdW5jdGlvbiBUYXNrQ29udHJvbGxlcigkc2NvcGUsICRyb3V0ZVBhcmFtcywgQXBwbGljYXRpb25TdGF0ZSwgUHJvamVjdFJlcG9zaXRvcnksIFRhc2tSZXBvc2l0b3J5KSB7XG4gICAgICAgIHZhciBwcm9qZWN0SUQgPSAkcm91dGVQYXJhbXMucHJvamVjdElEO1xuICAgICAgICB2YXIgdGFza0lEID0gJHJvdXRlUGFyYW1zLnRhc2tJRDtcbiAgICAgICAgJHNjb3BlLnByb2plY3RJRCA9IHByb2plY3RJRDtcbiAgICAgICAgJHNjb3BlLnRhc2tJRCA9IHRhc2tJRDtcblxuICAgICAgICBBcHBsaWNhdGlvblN0YXRlLnNldENvbnRleHQoJ3Byb2plY3QnKTtcbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRSaWdodENvbnRleHQoJ3Rhc2snKTtcbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRBY3RpdmVQcm9qZWN0KHByb2plY3RJRCk7XG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0QWN0aXZlVGFzayh0YXNrSUQpO1xuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5maW5kKHByb2plY3RJRCwgQXBwbGljYXRpb25TdGF0ZSk7XG4gICAgICAgIFRhc2tSZXBvc2l0b3J5LmZpbmQodGFza0lELCBBcHBsaWNhdGlvblN0YXRlKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwibXlUYXNrTGlzdFwiLCBteVRhc2tMaXN0KTtcblxuICAgIG15VGFza0xpc3QuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIG15VGFza0xpc3QoJGh0dHApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL215LXRhc2stbGlzdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Rhc2tzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFza3MgPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ210bCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwicHJvamVjdERldGFpbHNcIiwgcHJvamVjdERldGFpbHMpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdERldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9wcm9qZWN0LWRldGFpbHMuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmRpcmVjdGl2ZShcInByb2plY3RUYXNrc1wiLCBwcm9qZWN0VGFza3MpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdFRhc2tzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdC10YXNrcy5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInRhc2tEZXRhaWxzXCIsIHRhc2tEZXRhaWxzKTtcblxuICAgIGZ1bmN0aW9uIHRhc2tEZXRhaWxzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay1kZXRhaWxzLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInRhc2tMaW5rXCIsIHRhc2tMaW5rKTtcblxuICAgIGZ1bmN0aW9uIHRhc2tMaW5rKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay1saW5rLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5zZXJ2aWNlKCdQcm9qZWN0UmVwb3NpdG9yeScsIFByb2plY3RSZXBvc2l0b3J5KTtcblxuICAgIFByb2plY3RSZXBvc2l0b3J5LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBQcm9qZWN0UmVwb3NpdG9yeSgkaHR0cCkge1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICAgICAgYXV0aFVzZXI6IGF1dGhVc2VyXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSW1wbGVtZW50YXRpb25cbiAgICAgICAgZnVuY3Rpb24gYWxsKHN0YXRlKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuc2V0QWxsUHJvamVjdHMoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGZpbmQoaWQsIHN0YXRlKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnNldEN1cnJlbnRQcm9qZWN0KGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdXRoVXNlcihzdGF0ZSkge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlci9wcm9qZWN0cycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLnNldEF1dGhVc2VyUHJvamVjdHMoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5zZXJ2aWNlKCdUYXNrUmVwb3NpdG9yeScsIFRhc2tSZXBvc2l0b3J5KTtcblxuICAgIFRhc2tSZXBvc2l0b3J5LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBUYXNrUmVwb3NpdG9yeSgkaHR0cCkge1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICAgICAgYnlQcm9qZWN0OiBieVByb2plY3QsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3RhdGUpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3Rhc2snKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5zZXRBbGxQcm9qZWN0cyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZCh0YXNrSUQsIHN0YXRlKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy90YXNrLycrdGFza0lEKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5zZXRDdXJyZW50VGFzayhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYnlQcm9qZWN0KGlkLCBzdGF0ZSkge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdC8nK2lkKycvdGFza3MnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS50YXNrcyA9IGRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhVc2VyKG1vZGVsKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Rhc2tzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgbW9kZWwuYXV0aFVzZXJUYXNrcyA9IGRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcblx0LmZhY3RvcnkoJ1NpZGViaWV3TW9kZWwnLCBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuICAgICAgICAgICAgYWxsUHJvamVjdHM6IFtdLFxuXHRcdFx0YXV0aFVzZXJQcm9qZWN0czogW10sXG4gICAgICAgICAgICBhY3RpdmVQcm9qZWN0OiBudWxsLFxuICAgICAgICAgICAgaXNBY3RpdmVQcm9qZWN0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVByb2plY3QgPT09IGluZGV4O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEFjdGl2ZVByb2plY3Q6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVQcm9qZWN0ID0gaW5kZXg7XG4gICAgICAgICAgICB9XG5cdFx0fTtcblx0fSk7XG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==