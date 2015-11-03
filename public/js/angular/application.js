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
	    .controller("MainController", MainController);

    MainController.$inject = ['MainViewModel'];

    function MainController(MainViewModel) {
        this.vm = MainViewModel;
    }
})();
(function() {
	angular
        .module('app')
	    .controller("ProjectController", ProjectController);

    ProjectController.$inject = ["$scope", "$routeParams", "MainViewModel", "ProjectRepository"];

    function ProjectController($scope, $routeParams, MainViewModel, ProjectRepository) {
        var projectID = $routeParams.projectID;
        $scope.projectID = projectID;
        MainViewModel.setContext('project');
        MainViewModel.setRightContext('project');
        MainViewModel.setActiveProject(projectID);
        ProjectRepository.find(projectID, MainViewModel);
    }
})();
(function() {
	angular
        .module('app')
	    .controller("SidebarController", SidebarController);

    SidebarController.$inject = ['$scope', 'ProjectRepository', 'MainViewModel'];

    function SidebarController($scope, ProjectRepository, MainViewModel) {
        ProjectRepository.all(MainViewModel);
        ProjectRepository.authUser(MainViewModel);
    }
})();

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
        function all(model) {
            $http.get('/project').success(function(data) {
                model.setAllProjects(data);
            });
        }

        function find(id, model) {
            $http.get('/project/'+id).success(function(data) {
                model.setCurrentProject(data);
            });
        }

        function authUser(model) {
            $http.get('/user/projects').success(function(data) {
                model.setAuthUserProjects(data);
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
        function all(model) {
            $http.get('/task').success(function(data) {
                model.setAllProjects(data);
            });
        }

        function find(taskID, model) {
            $http.get('/task/'+taskID).success(function(data) {
                model.setCurrentTask(data);
            });
        }

        function byProject(id, model) {
            $http.get('/project/'+id+'/tasks').success(function(data) {
                model.tasks = data;
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
	    .factory('MainViewModel', MainViewModel);

    function MainViewModel() {

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
	angular.module('app')
	.factory('SidebarViewModel', function() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwiY29udHJvbGxlcnMvbWFpbi5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcHJvamVjdC5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvc2lkZWJhci5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvdGFzay5jb250cm9sbGVyLmpzIiwicmVwb3NpdG9yaWVzL3Byb2plY3QucmVwb3NpdG9yeS5qcyIsInJlcG9zaXRvcmllcy90YXNrLnJlcG9zaXRvcnkuanMiLCJkaXJlY3RpdmVzL215LXRhc2stbGlzdC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtZGV0YWlscy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Byb2plY3QtdGFza3MuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90YXNrLWxpbmsuZGlyZWN0aXZlLmpzIiwidmlld19tb2RlbHMvbWFpbi52aWV3bW9kZWwuanMiLCJ2aWV3X21vZGVscy9zaWRlYmFyLnZpZXdtb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZSddKVxuXHQgICAgLmNvbmZpZyhjb25maWcpO1xuXG4gICAgY29uZmlnLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBjb25maWcoJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgICAgICAgIC53aGVuKCcvcHJvamVjdC86cHJvamVjdElEJywge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0Q29udHJvbGxlcidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAud2hlbignL3Byb2plY3QvOnByb2plY3RJRC90YXNrLzp0YXNrSUQnLCB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvdGFzay5odG1sJyxcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVGFza0NvbnRyb2xsZXInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLmNvbnRyb2xsZXIoXCJNYWluQ29udHJvbGxlclwiLCBNYWluQ29udHJvbGxlcik7XG5cbiAgICBNYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWydNYWluVmlld01vZGVsJ107XG5cbiAgICBmdW5jdGlvbiBNYWluQ29udHJvbGxlcihNYWluVmlld01vZGVsKSB7XG4gICAgICAgIHRoaXMudm0gPSBNYWluVmlld01vZGVsO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIlByb2plY3RDb250cm9sbGVyXCIsIFByb2plY3RDb250cm9sbGVyKTtcblxuICAgIFByb2plY3RDb250cm9sbGVyLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkcm91dGVQYXJhbXNcIiwgXCJNYWluVmlld01vZGVsXCIsIFwiUHJvamVjdFJlcG9zaXRvcnlcIl07XG5cbiAgICBmdW5jdGlvbiBQcm9qZWN0Q29udHJvbGxlcigkc2NvcGUsICRyb3V0ZVBhcmFtcywgTWFpblZpZXdNb2RlbCwgUHJvamVjdFJlcG9zaXRvcnkpIHtcbiAgICAgICAgdmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XG4gICAgICAgICRzY29wZS5wcm9qZWN0SUQgPSBwcm9qZWN0SUQ7XG4gICAgICAgIE1haW5WaWV3TW9kZWwuc2V0Q29udGV4dCgncHJvamVjdCcpO1xuICAgICAgICBNYWluVmlld01vZGVsLnNldFJpZ2h0Q29udGV4dCgncHJvamVjdCcpO1xuICAgICAgICBNYWluVmlld01vZGVsLnNldEFjdGl2ZVByb2plY3QocHJvamVjdElEKTtcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIE1haW5WaWV3TW9kZWwpO1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuY29udHJvbGxlcihcIlNpZGViYXJDb250cm9sbGVyXCIsIFNpZGViYXJDb250cm9sbGVyKTtcblxuICAgIFNpZGViYXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICdQcm9qZWN0UmVwb3NpdG9yeScsICdNYWluVmlld01vZGVsJ107XG5cbiAgICBmdW5jdGlvbiBTaWRlYmFyQ29udHJvbGxlcigkc2NvcGUsIFByb2plY3RSZXBvc2l0b3J5LCBNYWluVmlld01vZGVsKSB7XG4gICAgICAgIFByb2plY3RSZXBvc2l0b3J5LmFsbChNYWluVmlld01vZGVsKTtcbiAgICAgICAgUHJvamVjdFJlcG9zaXRvcnkuYXV0aFVzZXIoTWFpblZpZXdNb2RlbCk7XG4gICAgfVxufSkoKTtcbiIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuICAgIFx0LmNvbnRyb2xsZXIoXCJUYXNrQ29udHJvbGxlclwiLCBUYXNrQ29udHJvbGxlcik7XG5cbiAgICBUYXNrQ29udHJvbGxlci4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiTWFpblZpZXdNb2RlbFwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCIsIFwiVGFza1JlcG9zaXRvcnlcIl07XG5cbiAgICBmdW5jdGlvbiBUYXNrQ29udHJvbGxlcigkc2NvcGUsICRyb3V0ZVBhcmFtcywgTWFpblZpZXdNb2RlbCwgUHJvamVjdFJlcG9zaXRvcnksIFRhc2tSZXBvc2l0b3J5KSB7XG4gICAgICAgIHZhciBwcm9qZWN0SUQgPSAkcm91dGVQYXJhbXMucHJvamVjdElEO1xuICAgICAgICB2YXIgdGFza0lEID0gJHJvdXRlUGFyYW1zLnRhc2tJRDtcbiAgICAgICAgJHNjb3BlLnByb2plY3RJRCA9IHByb2plY3RJRDtcbiAgICAgICAgJHNjb3BlLnRhc2tJRCA9IHRhc2tJRDtcblxuICAgICAgICBNYWluVmlld01vZGVsLnNldENvbnRleHQoJ3Byb2plY3QnKTtcbiAgICAgICAgTWFpblZpZXdNb2RlbC5zZXRSaWdodENvbnRleHQoJ3Rhc2snKTtcbiAgICAgICAgTWFpblZpZXdNb2RlbC5zZXRBY3RpdmVQcm9qZWN0KHByb2plY3RJRCk7XG4gICAgICAgIE1haW5WaWV3TW9kZWwuc2V0QWN0aXZlVGFzayh0YXNrSUQpO1xuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5maW5kKHByb2plY3RJRCwgTWFpblZpZXdNb2RlbCk7XG4gICAgICAgIFRhc2tSZXBvc2l0b3J5LmZpbmQodGFza0lELCBNYWluVmlld01vZGVsKTtcbiAgICB9XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLnNlcnZpY2UoJ1Byb2plY3RSZXBvc2l0b3J5JywgUHJvamVjdFJlcG9zaXRvcnkpO1xuXG4gICAgUHJvamVjdFJlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFByb2plY3RSZXBvc2l0b3J5KCRodHRwKSB7XG5cbiAgICAgICAgLy8gQVBJXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGZpbmQ6IGZpbmQsXG4gICAgICAgICAgICBhdXRoVXNlcjogYXV0aFVzZXJcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBJbXBsZW1lbnRhdGlvblxuICAgICAgICBmdW5jdGlvbiBhbGwobW9kZWwpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3Byb2plY3QnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5zZXRBbGxQcm9qZWN0cyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZChpZCwgbW9kZWwpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3Byb2plY3QvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgbW9kZWwuc2V0Q3VycmVudFByb2plY3QoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhVc2VyKG1vZGVsKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy91c2VyL3Byb2plY3RzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgbW9kZWwuc2V0QXV0aFVzZXJQcm9qZWN0cyhkYXRhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxuXHQgICAgLnNlcnZpY2UoJ1Rhc2tSZXBvc2l0b3J5JywgVGFza1JlcG9zaXRvcnkpO1xuXG4gICAgVGFza1JlcG9zaXRvcnkuJGluamVjdCA9IFsnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFRhc2tSZXBvc2l0b3J5KCRodHRwKSB7XG5cbiAgICAgICAgLy8gQVBJXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbGw6IGFsbCxcbiAgICAgICAgICAgIGZpbmQ6IGZpbmQsXG4gICAgICAgICAgICBieVByb2plY3Q6IGJ5UHJvamVjdCxcbiAgICAgICAgICAgIGF1dGhVc2VyOiBhdXRoVXNlclxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEltcGxlbWVudGF0aW9uXG4gICAgICAgIGZ1bmN0aW9uIGFsbChtb2RlbCkge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdGFzaycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIG1vZGVsLnNldEFsbFByb2plY3RzKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBmaW5kKHRhc2tJRCwgbW9kZWwpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3Rhc2svJyt0YXNrSUQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIG1vZGVsLnNldEN1cnJlbnRUYXNrKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBieVByb2plY3QoaWQsIG1vZGVsKSB7XG4gICAgICAgICAgICAkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQrJy90YXNrcycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIG1vZGVsLnRhc2tzID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gYXV0aFVzZXIobW9kZWwpIHtcbiAgICAgICAgICAgICRodHRwLmdldCgnL3VzZXIvdGFza3MnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBtb2RlbC5hdXRoVXNlclRhc2tzID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcIm15VGFza0xpc3RcIiwgbXlUYXNrTGlzdCk7XG5cbiAgICBteVRhc2tMaXN0LiRpbmplY3QgPSBbJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBteVRhc2tMaXN0KCRodHRwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZXN0cmljdDogXCJFXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9teS10YXNrLWxpc3QuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkaHR0cCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFza3MgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJGh0dHAuZ2V0KCcvdXNlci90YXNrcycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnRhc2tzID0gZGF0YTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdtdGwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcbiAgICAgICAgLmRpcmVjdGl2ZShcInByb2plY3REZXRhaWxzXCIsIHByb2plY3REZXRhaWxzKTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3REZXRhaWxzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzdHJpY3Q6IFwiRVwiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdC1kZXRhaWxzLmh0bWwnXG4gICAgICAgIH07XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcblx0ICAgIC5kaXJlY3RpdmUoXCJwcm9qZWN0VGFza3NcIiwgcHJvamVjdFRhc2tzKTtcblxuICAgIGZ1bmN0aW9uIHByb2plY3RUYXNrcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Byb2plY3QtdGFza3MuaHRtbCdcbiAgICAgICAgfTtcbiAgICB9XG5cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJ0YXNrRGV0YWlsc1wiLCB0YXNrRGV0YWlscyk7XG5cbiAgICBmdW5jdGlvbiB0YXNrRGV0YWlscygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Rhc2stZGV0YWlscy5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgICAgIC5kaXJlY3RpdmUoXCJ0YXNrTGlua1wiLCB0YXNrTGluayk7XG5cbiAgICBmdW5jdGlvbiB0YXNrTGluaygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3RyaWN0OiBcIkVcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Rhc2stbGluay5odG1sJ1xuICAgICAgICB9O1xuICAgIH1cbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXG5cdCAgICAuZmFjdG9yeSgnTWFpblZpZXdNb2RlbCcsIE1haW5WaWV3TW9kZWwpO1xuXG4gICAgZnVuY3Rpb24gTWFpblZpZXdNb2RlbCgpIHtcblxuICAgICAgICAvLyBQcml2YXRlIFN0YXRlXG4gICAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgICAgIGNvbnRleHQ6IFwiaG9tZVwiLFxuICAgICAgICAgICAgcmlnaHRDb250ZXh0OiBcImhvbWVcIixcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0OiB7fSxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IG51bGwsXG4gICAgICAgICAgICBjdXJyZW50VGFzazoge30sXG4gICAgICAgICAgICBhbGxQcm9qZWN0czogW10sXG4gICAgICAgICAgICBhdXRoVXNlclByb2plY3RzOiBbXSxcbiAgICAgICAgICAgIGFjdGl2ZVRhc2s6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBUElcbiAgICAgICAgcmV0dXJuIHtcblxuICAgICAgICAgICAgLy8gQ29udGV4dFxuICAgICAgICAgICAgc2V0Q29udGV4dDogc2V0Q29udGV4dCxcbiAgICAgICAgICAgIGdldENvbnRleHQ6IGdldENvbnRleHQsXG4gICAgICAgICAgICBzZXRSaWdodENvbnRleHQ6IHNldFJpZ2h0Q29udGV4dCxcbiAgICAgICAgICAgIGdldFJpZ2h0Q29udGV4dDogZ2V0UmlnaHRDb250ZXh0LFxuXG4gICAgICAgICAgICAvLyBQcm9qZWN0c1xuICAgICAgICAgICAgaXNBY3RpdmVQcm9qZWN0OiBpc0FjdGl2ZVByb2plY3QsXG4gICAgICAgICAgICBzZXRBY3RpdmVQcm9qZWN0OiBzZXRBY3RpdmVQcm9qZWN0LFxuICAgICAgICAgICAgZ2V0QWN0aXZlUHJvamVjdDogZ2V0QWN0aXZlUHJvamVjdCxcbiAgICAgICAgICAgIHNldEN1cnJlbnRQcm9qZWN0OiBzZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIGdldEN1cnJlbnRQcm9qZWN0OiBnZXRDdXJyZW50UHJvamVjdCxcbiAgICAgICAgICAgIHNldEFsbFByb2plY3RzOiBzZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIGdldEFsbFByb2plY3RzOiBnZXRBbGxQcm9qZWN0cyxcbiAgICAgICAgICAgIHNldEF1dGhVc2VyUHJvamVjdHM6IHNldEF1dGhVc2VyUHJvamVjdHMsXG4gICAgICAgICAgICBnZXRBdXRoVXNlclByb2plY3RzOiBnZXRBdXRoVXNlclByb2plY3RzLFxuXG4gICAgICAgICAgICAvLyBUYXNrc1xuICAgICAgICAgICAgaXNBY3RpdmVUYXNrOiBpc0FjdGl2ZVRhc2ssXG4gICAgICAgICAgICBnZXRDdXJyZW50VGFzazogZ2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBzZXRDdXJyZW50VGFzazogc2V0Q3VycmVudFRhc2ssXG4gICAgICAgICAgICBzZXRBY3RpdmVUYXNrOiBzZXRBY3RpdmVUYXNrLFxuICAgICAgICAgICAgZ2V0QWN0aXZlVGFzazogZ2V0QWN0aXZlVGFzayxcbiAgICAgICAgICAgIGdldFRhc2tMaW5rOiBnZXRUYXNrTGlua1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEltcGxlbWVudGF0aW9uXG4gICAgICAgIGZ1bmN0aW9uIHNldENvbnRleHQoY29udGV4dCkge1xuICAgICAgICAgICAgc3RhdGUuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmNvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRSaWdodENvbnRleHQoY29udGV4dCkge1xuICAgICAgICAgICAgc3RhdGUucmlnaHRDb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFJpZ2h0Q29udGV4dCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5yaWdodENvbnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0FjdGl2ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVByb2plY3QoKSA9PSBpbmRleCAmJiB0aGlzLmdldENvbnRleHQoKSA9PSBcInByb2plY3RcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEFjdGl2ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZVByb2plY3QgPSBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3QoKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuYWN0aXZlUHJvamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRQcm9qZWN0KHByb2plY3QpIHtcbiAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRQcm9qZWN0ID0gcHJvamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRQcm9qZWN0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmN1cnJlbnRQcm9qZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QWxsUHJvamVjdHMocHJvamVjdHMpIHtcbiAgICAgICAgICAgIHN0YXRlLmFsbFByb2plY3RzID0gcHJvamVjdHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRBbGxQcm9qZWN0cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hbGxQcm9qZWN0cztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRUYXNrKGN1cnJlbnRUYXNrKSB7XG4gICAgICAgICAgICBzdGF0ZS5jdXJyZW50VGFzayA9IGN1cnJlbnRUYXNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFRhc2soKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuY3VycmVudFRhc2s7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBpc0FjdGl2ZVRhc2soaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldEFjdGl2ZVRhc2soKSA9PSBpbmRleCAmJiB0aGlzLmdldFJpZ2h0Q29udGV4dCgpID09IFwidGFza1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QWN0aXZlVGFzayhpbmRleCkge1xuICAgICAgICAgICAgc3RhdGUuYWN0aXZlVGFzayA9IGluZGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QWN0aXZlVGFzaygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hY3RpdmVUYXNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0QXV0aFVzZXJQcm9qZWN0cyhwcm9qZWN0cykge1xuICAgICAgICAgICAgc3RhdGUuYXV0aFVzZXJQcm9qZWN0cyA9IHByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0QXV0aFVzZXJQcm9qZWN0cygpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5hdXRoVXNlclByb2plY3RzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VGFza0xpbmsodGFzaykge1xuICAgICAgICAgICAgdmFyIHVybCA9ICcjL3Byb2plY3QvJyt0YXNrLnByb2plY3RfaWQ7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNBY3RpdmVUYXNrKHRhc2suaWQpKSB7XG4gICAgICAgICAgICAgICAgdXJsID0gdXJsKycvdGFzay8nK3Rhc2suaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgICB9XG4gICAgfVxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuZmFjdG9yeSgnU2lkZWJhclZpZXdNb2RlbCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgICAgICBhbGxQcm9qZWN0czogW10sXG5cdFx0XHRhdXRoVXNlclByb2plY3RzOiBbXSxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IG51bGwsXG4gICAgICAgICAgICBpc0FjdGl2ZVByb2plY3Q6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUHJvamVjdCA9PT0gaW5kZXg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0QWN0aXZlUHJvamVjdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVByb2plY3QgPSBpbmRleDtcbiAgICAgICAgICAgIH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9