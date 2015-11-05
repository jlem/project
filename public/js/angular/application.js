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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic3RhdGUuanMiLCJjb250cm9sbGVycy9tYWluLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9zaWRlYmFyLmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy90YXNrLmNvbnRyb2xsZXIuanMiLCJyZXBvc2l0b3JpZXMvcHJvamVjdC5yZXBvc2l0b3J5LmpzIiwicmVwb3NpdG9yaWVzL3Rhc2sucmVwb3NpdG9yeS5qcyIsImRpcmVjdGl2ZXMvbXktdGFzay1saXN0LmRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcHJvamVjdC1kZXRhaWxzLmRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvcHJvamVjdC10YXNrcy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Rhc2stZGV0YWlscy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Rhc2stbGluay5kaXJlY3RpdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKVxuXHQgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgY29uZmlnLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBjb25maWcoJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC53aGVuKCcvcHJvamVjdC86cHJvamVjdElEJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0Q29udHJvbGxlcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3Byb2plY3QvOnByb2plY3RJRC90YXNrLzp0YXNrSUQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGFza0NvbnRyb2xsZXInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdBcHBsaWNhdGlvblN0YXRlJywgQXBwbGljYXRpb25TdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiBBcHBsaWNhdGlvblN0YXRlKCkge1xuXG4gICAgICAgIC8vIFByaXZhdGUgU3RhdGVcbiAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgY29udGV4dDogXCJob21lXCIsXG4gICAgICAgICAgICByaWdodENvbnRleHQ6IFwiaG9tZVwiLFxuICAgICAgICAgICAgY3VycmVudFByb2plY3Q6IHt9LFxuICAgICAgICAgICAgY3VycmVudFRhc2s6IHt9LFxuICAgICAgICAgICAgYWxsUHJvamVjdHM6IFtdLFxuICAgICAgICAgICAgYXV0aFVzZXJQcm9qZWN0czogW11cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBUElcbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgLy8gQ29udGV4dFxuICAgICAgICAgICAgY2hhbmdlVG9Qcm9qZWN0Q29udGV4dDogY2hhbmdlVG9Qcm9qZWN0Q29udGV4dCxcbiAgICAgICAgICAgIGNoYW5nZVRvVGFza0NvbnRleHQ6IGNoYW5nZVRvVGFza0NvbnRleHQsXG4gICAgICAgICAgICBnZXRDb250ZXh0OiBnZXRDb250ZXh0LFxuICAgICAgICAgICAgZ2V0UmlnaHRDb250ZXh0OiBnZXRSaWdodENvbnRleHQsXG5cbiAgICAgICAgICAgIC8vIFByb2plY3RzXG4gICAgICAgICAgICBpc0FjdGl2ZVByb2plY3Q6IGlzQWN0aXZlUHJvamVjdCxcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9qZWN0OiBzZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGdldEN1cnJlbnRQcm9qZWN0OiBnZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIHNldEFsbFByb2plY3RzOiBzZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIGdldEFsbFByb2plY3RzOiBnZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIHNldEF1dGhVc2VyUHJvamVjdHM6IHNldEF1dGhVc2VyUHJvamVjdHMsXG4gICAgICAgICAgICBnZXRBdXRoVXNlclByb2plY3RzOiBnZXRBdXRoVXNlclByb2plY3RzLFxuXG4gICAgICAgICAgICAvLyBUYXNrc1xuICAgICAgICAgICAgaXNBY3RpdmVUYXNrOiBpc0FjdGl2ZVRhc2ssXG4gICAgICAgICAgICBnZXRDdXJyZW50VGFzazogZ2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBzZXRDdXJyZW50VGFzazogc2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBnZXRUYXNrTGluazogZ2V0VGFza0xpbmtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VUb1Byb2plY3RDb250ZXh0KCkge1xuICAgICAgICAgICAgc3RhdGUuY29udGV4dCA9ICdwcm9qZWN0JztcbiAgICAgICAgICAgIHN0YXRlLnJpZ2h0Q29udGV4dCA9ICdwcm9qZWN0JztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVRvVGFza0NvbnRleHQoKSB7XG4gICAgICAgICAgICBzdGF0ZS5jb250ZXh0ID0gJ3Byb2plY3QnO1xuICAgICAgICAgICAgc3RhdGUucmlnaHRDb250ZXh0ID0gJ3Rhc2snO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5jb250ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0UmlnaHRDb250ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnJpZ2h0Q29udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGlzQWN0aXZlUHJvamVjdChpbmRleCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q3VycmVudFByb2plY3QoKS5pZCA9PSBpbmRleCAmJiB0aGlzLmdldENvbnRleHQoKSA9PSBcInByb2plY3RcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRQcm9qZWN0KHByb2plY3QpIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRQcm9qZWN0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmN1cnJlbnRQcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QWxsUHJvamVjdHMocHJvamVjdHMpIHtcbiAgICAgICAgICAgIHN0YXRlLmFsbFByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGxQcm9qZWN0cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbGxQcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRUYXNrKGN1cnJlbnRUYXNrKSB7XG4gICAgICAgICAgICBzdGF0ZS5jdXJyZW50VGFzayA9IGN1cnJlbnRUYXNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFRhc2soKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY3VycmVudFRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0FjdGl2ZVRhc2soaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRUYXNrKCkuaWQgPT0gaW5kZXggJiYgdGhpcy5nZXRSaWdodENvbnRleHQoKSA9PSBcInRhc2tcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEF1dGhVc2VyUHJvamVjdHMocHJvamVjdHMpIHtcbiAgICAgICAgICAgIHN0YXRlLmF1dGhVc2VyUHJvamVjdHMgPSBwcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEF1dGhVc2VyUHJvamVjdHMoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuYXV0aFVzZXJQcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRhc2tMaW5rKHRhc2spIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSAnIy9wcm9qZWN0LycrdGFzay5wcm9qZWN0X2lkO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlVGFzayh0YXNrLmlkKSkge1xuICAgICAgICAgICAgICAgIHVybCA9IHVybCsnL3Rhc2svJyt0YXNrLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIk1haW5Db250cm9sbGVyXCIsIE1haW5Db250cm9sbGVyKTtcblxuICAgIE1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0FwcGxpY2F0aW9uU3RhdGUnXTtcblxuICAgIGZ1bmN0aW9uIE1haW5Db250cm9sbGVyKEFwcGxpY2F0aW9uU3RhdGUpIHtcbiAgICAgICAgdGhpcy52bSA9IEFwcGxpY2F0aW9uU3RhdGU7XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5jb250cm9sbGVyKFwiUHJvamVjdENvbnRyb2xsZXJcIiwgUHJvamVjdENvbnRyb2xsZXIpO1xuXG4gICAgUHJvamVjdENvbnRyb2xsZXIuJGluamVjdCA9IFtcIiRyb3V0ZVBhcmFtc1wiLCBcIkFwcGxpY2F0aW9uU3RhdGVcIiwgXCJQcm9qZWN0UmVwb3NpdG9yeVwiXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RDb250cm9sbGVyKCRyb3V0ZVBhcmFtcywgQXBwbGljYXRpb25TdGF0ZSwgUHJvamVjdFJlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG5cbiAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5jaGFuZ2VUb1Byb2plY3RDb250ZXh0KCk7XG5cbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDdXJyZW50UHJvamVjdChyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmNvbnRyb2xsZXIoXCJTaWRlYmFyQ29udHJvbGxlclwiLCBTaWRlYmFyQ29udHJvbGxlcik7XG5cbiAgICBTaWRlYmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnUHJvamVjdFJlcG9zaXRvcnknLCAnQXBwbGljYXRpb25TdGF0ZSddO1xuXG4gICAgZnVuY3Rpb24gU2lkZWJhckNvbnRyb2xsZXIoJHNjb3BlLCBQcm9qZWN0UmVwb3NpdG9yeSwgQXBwbGljYXRpb25TdGF0ZSkge1xuICAgICAgICBcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuYWxsKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRBbGxQcm9qZWN0cyhyZXN1bHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5hdXRoVXNlcihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0QXV0aFVzZXJQcm9qZWN0cyhyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgXHQuY29udHJvbGxlcihcIlRhc2tDb250cm9sbGVyXCIsIFRhc2tDb250cm9sbGVyKTtcblxuICAgIFRhc2tDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCJBcHBsaWNhdGlvblN0YXRlXCIsIFwiUHJvamVjdFJlcG9zaXRvcnlcIiwgXCJUYXNrUmVwb3NpdG9yeVwiXTtcblxuICAgIGZ1bmN0aW9uIFRhc2tDb250cm9sbGVyKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBBcHBsaWNhdGlvblN0YXRlLCBQcm9qZWN0UmVwb3NpdG9yeSwgVGFza1JlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG4gICAgICAgIHZhciB0YXNrSUQgPSAkcm91dGVQYXJhbXMudGFza0lEO1xuXG4gICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuY2hhbmdlVG9UYXNrQ29udGV4dCgpO1xuXG4gICAgICAgIFByb2plY3RSZXBvc2l0b3J5LmZpbmQocHJvamVjdElELCBmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uU3RhdGUuc2V0Q3VycmVudFByb2plY3QocmVzdWx0KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgVGFza1JlcG9zaXRvcnkuZmluZCh0YXNrSUQsIGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgQXBwbGljYXRpb25TdGF0ZS5zZXRDdXJyZW50VGFzayhyZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLnNlcnZpY2UoJ1Byb2plY3RSZXBvc2l0b3J5JywgUHJvamVjdFJlcG9zaXRvcnkpO1xuXG4gICAgUHJvamVjdFJlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RSZXBvc2l0b3J5KCRodHRwKSB7XG5cbiAgICAgICAgLy8gQVBJXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGZpbmQ6IGZpbmQsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdCcpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKGlkLCBzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdXRoVXNlcihzdWNjZXNzKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Byb2plY3RzJykuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5zZXJ2aWNlKCdUYXNrUmVwb3NpdG9yeScsIFRhc2tSZXBvc2l0b3J5KTtcblxuICAgIFRhc2tSZXBvc2l0b3J5LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBUYXNrUmVwb3NpdG9yeSgkaHR0cCkge1xuXG4gICAgICAgIC8vIEFQSVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICAgICAgYnlQcm9qZWN0OiBieVByb2plY3QsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzaycpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKHRhc2tJRCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzay8nK3Rhc2tJRCkuc3VjY2VzcyhzdWNjZXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJ5UHJvamVjdChpZCwgc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvcHJvamVjdC8nK2lkKycvdGFza3MnKS5zdWNjZXNzKHN1Y2Nlc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXV0aFVzZXIoc3VjY2Vzcykge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlci90YXNrcycpLnN1Y2Nlc3Moc3VjY2Vzcyk7XG4gICAgICAgIH1cbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwibXlUYXNrTGlzdFwiLCBteVRhc2tMaXN0KTtcblxuICAgIG15VGFza0xpc3QuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIG15VGFza0xpc3QoJGh0dHApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL215LXRhc2stbGlzdC5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXNrcyA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Rhc2tzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFza3MgPSBkYXRhO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ210bCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgICAgICAuZGlyZWN0aXZlKFwicHJvamVjdERldGFpbHNcIiwgcHJvamVjdERldGFpbHMpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdERldGFpbHMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9wcm9qZWN0LWRldGFpbHMuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmRpcmVjdGl2ZShcInByb2plY3RUYXNrc1wiLCBwcm9qZWN0VGFza3MpO1xuXG4gICAgZnVuY3Rpb24gcHJvamVjdFRhc2tzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdC10YXNrcy5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cblxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInRhc2tEZXRhaWxzXCIsIHRhc2tEZXRhaWxzKTtcblxuICAgIGZ1bmN0aW9uIHRhc2tEZXRhaWxzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay1kZXRhaWxzLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInRhc2tMaW5rXCIsIHRhc2tMaW5rKTtcblxuICAgIGZ1bmN0aW9uIHRhc2tMaW5rKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay1saW5rLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=