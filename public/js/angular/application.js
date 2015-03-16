(function() {
	var app = angular.module('app', ['ngRoute']);
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.
			when('/project/:projectID', {
				templateUrl: '/partials/null.html',
				controller: 'ProjectController'
			}).
			when('/project/:projectID/task/:taskID', {
				templateUrl: '/partials/null.html',
				controller: 'TaskController'
			})
			.otherwise({
		        redirectTo: '/'
		    });
	}]);
})();
(function() {
	angular.module('app')
	.controller("MainController", ['$scope', 'MainViewModel', function($scope, MainViewModel) {
		$scope.model = MainViewModel;
	}]);
})();
(function() {
	angular.module('app')
	.controller("ProjectController", ["$scope", "$routeParams", "MainViewModel", "ProjectRepository", function($scope, $routeParams, MainViewModel, ProjectRepository) {
		var projectID = $routeParams.projectID;
		$scope.projectID = projectID;
		MainViewModel.setContext('project');
		MainViewModel.setRightContext('project');
		MainViewModel.setActiveProject(projectID);
		ProjectRepository.find(projectID, MainViewModel);
	}]);
})();
(function() {
	angular.module('app')
	.controller("SidebarController", ["$scope", "ProjectRepository", "MainViewModel", function($scope, ProjectRepository, MainViewModel) {
		ProjectRepository.all(MainViewModel);
	    ProjectRepository.authUser(MainViewModel);
	}]);
})();
(function() {
	angular.module('app')
	.controller("TaskController", ["$scope", "$routeParams", "MainViewModel", "ProjectRepository", "TaskRepository", function($scope, $routeParams, MainViewModel, ProjectRepository, TaskRepository) {
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

		console.log(MainViewModel.activeTask);
	}]);
})();
(function() {
	angular.module('app')
	.directive("myTaskList", ["$http", function($http) {
		return {
			restrict: "E",
			templateUrl: '/partials/my-task-list.html',
			controller: ["$http", function($http) {
				this.tasks = [];
				var that = this;
				$http.get('/user/tasks').success(function(data) {
					that.tasks = data;
				});
			}],
			controllerAs: 'mtl'
		};
	}]);
})();
(function() {
	angular.module('app')
	.directive("projectDetails", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/project-details.html'
		};
	});
})();
(function() {
	angular.module('app')
	.directive("projectTasks", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/project-tasks.html'
		};
	});
})();
(function() {
	angular.module('app')
	.directive("taskDetails", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/task-details.html'
		};
	});
})();
(function() {
	angular.module('app')
	.directive("taskLink", function() {
		return {
			restrict: "E",
			templateUrl: '/partials/task-link.html'
		};
	});
})();
(function() {
	angular.module('app')
	.service('ProjectRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/project').success(function(data) {
					model.allProjects = data;
				});
			},
			find : function(id, model) {
				$http.get('/project/'+id).success(function(data) {
					model.currentProject = {};
					model.currentProject = data;
				});
			},
			authUser : function(model) {
				$http.get('/user/projects').success(function(data) {
					model.authUserProjects = data;
				});
			}
		};
	}]);
})();
(function() {
	angular.module('app')
	.service('TaskRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/task').success(function(data) {
					model.allProjects = data;
				});
			},
			find : function(taskID, model) {
				$http.get('/task/'+taskID).success(function(data) {
					model.currentTask = data;
				});
			},
			byProject : function(model) {
				$http.get('/project/'+id+'/tasks').success(function(data) {
					model.tasks = data;
				});
			},
			authUser : function(model) {
				$http.get('/user/tasks').success(function(data) {
					model.authUserTasks = data;
				});
			}
		};
	}]);
})();
(function() {
	angular.module('app')
	.factory('MainViewModel', function() {
		return {
            context: "home",
            rightContext: "home",
            allProjects: [],
			authUserProjects: [],
            activeProject: null,
            currentProject: {},
            activeTask: null,
            currentTask: {},
            
            isActiveProject: function(index) {
                return this.activeProject == index && this.context == "project";
            },
            setActiveProject: function(index) {
                this.activeProject = index;
            },
            isActiveTask: function(index) {
                return this.activeTask == index && this.rightContext == "task";
            },
            setActiveTask: function(index) {
                this.activeTask = index;
            },
            setContext: function(context) {
                this.context = context;
            },
            setRightContext: function(context) {
                this.rightContext = context;
            },
            getTaskLink: function(task) {
                var url = '#/project/'+task.project_id;
                if (!this.isActiveTask(task.id)) {
                    url = url+'/task/'+task.id;
                }
                return url;
            }
		};
	});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwiY29udHJvbGxlcnNcXG1haW4uY29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzXFxwcm9qZWN0LmNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVyc1xcc2lkZWJhci5jb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnNcXHRhc2suY29udHJvbGxlci5qcyIsImRpcmVjdGl2ZXNcXG15LXRhc2stbGlzdC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzXFxwcm9qZWN0LWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlc1xccHJvamVjdC10YXNrcy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzXFx0YXNrLWRldGFpbHMuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlc1xcdGFzay1saW5rLmRpcmVjdGl2ZS5qcyIsInJlcG9zaXRvcmllc1xccHJvamVjdC5yZXBvc2l0b3J5LmpzIiwicmVwb3NpdG9yaWVzXFx0YXNrLnJlcG9zaXRvcnkuanMiLCJ2aWV3X21vZGVsc1xcbWFpbi52aWV3bW9kZWwuanMiLCJ2aWV3X21vZGVsc1xcc2lkZWJhci52aWV3bW9kZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG5cdHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJ10pO1xyXG5cdGFwcC5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XHJcblx0XHQkcm91dGVQcm92aWRlci5cclxuXHRcdFx0d2hlbignL3Byb2plY3QvOnByb2plY3RJRCcsIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9udWxsLmh0bWwnLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdQcm9qZWN0Q29udHJvbGxlcidcclxuXHRcdFx0fSkuXHJcblx0XHRcdHdoZW4oJy9wcm9qZWN0Lzpwcm9qZWN0SUQvdGFzay86dGFza0lEJywge1xyXG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL251bGwuaHRtbCcsXHJcblx0XHRcdFx0Y29udHJvbGxlcjogJ1Rhc2tDb250cm9sbGVyJ1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub3RoZXJ3aXNlKHtcclxuXHRcdCAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcblx0XHQgICAgfSk7XHJcblx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuY29udHJvbGxlcihcIk1haW5Db250cm9sbGVyXCIsIFsnJHNjb3BlJywgJ01haW5WaWV3TW9kZWwnLCBmdW5jdGlvbigkc2NvcGUsIE1haW5WaWV3TW9kZWwpIHtcclxuXHRcdCRzY29wZS5tb2RlbCA9IE1haW5WaWV3TW9kZWw7XHJcblx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuY29udHJvbGxlcihcIlByb2plY3RDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIiRyb3V0ZVBhcmFtc1wiLCBcIk1haW5WaWV3TW9kZWxcIiwgXCJQcm9qZWN0UmVwb3NpdG9yeVwiLCBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgTWFpblZpZXdNb2RlbCwgUHJvamVjdFJlcG9zaXRvcnkpIHtcclxuXHRcdHZhciBwcm9qZWN0SUQgPSAkcm91dGVQYXJhbXMucHJvamVjdElEO1xyXG5cdFx0JHNjb3BlLnByb2plY3RJRCA9IHByb2plY3RJRDtcclxuXHRcdE1haW5WaWV3TW9kZWwuc2V0Q29udGV4dCgncHJvamVjdCcpO1xyXG5cdFx0TWFpblZpZXdNb2RlbC5zZXRSaWdodENvbnRleHQoJ3Byb2plY3QnKTtcclxuXHRcdE1haW5WaWV3TW9kZWwuc2V0QWN0aXZlUHJvamVjdChwcm9qZWN0SUQpO1xyXG5cdFx0UHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIE1haW5WaWV3TW9kZWwpO1xyXG5cdH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcblx0LmNvbnRyb2xsZXIoXCJTaWRlYmFyQ29udHJvbGxlclwiLCBbXCIkc2NvcGVcIiwgXCJQcm9qZWN0UmVwb3NpdG9yeVwiLCBcIk1haW5WaWV3TW9kZWxcIiwgZnVuY3Rpb24oJHNjb3BlLCBQcm9qZWN0UmVwb3NpdG9yeSwgTWFpblZpZXdNb2RlbCkge1xyXG5cdFx0UHJvamVjdFJlcG9zaXRvcnkuYWxsKE1haW5WaWV3TW9kZWwpO1xyXG5cdCAgICBQcm9qZWN0UmVwb3NpdG9yeS5hdXRoVXNlcihNYWluVmlld01vZGVsKTtcclxuXHR9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG5cdC5jb250cm9sbGVyKFwiVGFza0NvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiJHJvdXRlUGFyYW1zXCIsIFwiTWFpblZpZXdNb2RlbFwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCIsIFwiVGFza1JlcG9zaXRvcnlcIiwgZnVuY3Rpb24oJHNjb3BlLCAkcm91dGVQYXJhbXMsIE1haW5WaWV3TW9kZWwsIFByb2plY3RSZXBvc2l0b3J5LCBUYXNrUmVwb3NpdG9yeSkge1xyXG5cdFx0dmFyIHByb2plY3RJRCA9ICRyb3V0ZVBhcmFtcy5wcm9qZWN0SUQ7XHJcblx0XHR2YXIgdGFza0lEID0gJHJvdXRlUGFyYW1zLnRhc2tJRDtcclxuXHRcdCRzY29wZS5wcm9qZWN0SUQgPSBwcm9qZWN0SUQ7XHJcblx0XHQkc2NvcGUudGFza0lEID0gdGFza0lEO1xyXG5cdFx0XHJcblx0XHRNYWluVmlld01vZGVsLnNldENvbnRleHQoJ3Byb2plY3QnKTtcclxuXHRcdE1haW5WaWV3TW9kZWwuc2V0UmlnaHRDb250ZXh0KCd0YXNrJyk7XHJcblx0XHRNYWluVmlld01vZGVsLnNldEFjdGl2ZVByb2plY3QocHJvamVjdElEKTtcclxuXHRcdE1haW5WaWV3TW9kZWwuc2V0QWN0aXZlVGFzayh0YXNrSUQpO1xyXG5cdFx0UHJvamVjdFJlcG9zaXRvcnkuZmluZChwcm9qZWN0SUQsIE1haW5WaWV3TW9kZWwpO1xyXG5cdFx0VGFza1JlcG9zaXRvcnkuZmluZCh0YXNrSUQsIE1haW5WaWV3TW9kZWwpO1xyXG5cclxuXHRcdGNvbnNvbGUubG9nKE1haW5WaWV3TW9kZWwuYWN0aXZlVGFzayk7XHJcblx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuZGlyZWN0aXZlKFwibXlUYXNrTGlzdFwiLCBbXCIkaHR0cFwiLCBmdW5jdGlvbigkaHR0cCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6IFwiRVwiLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9teS10YXNrLWxpc3QuaHRtbCcsXHJcblx0XHRcdGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRodHRwKSB7XHJcblx0XHRcdFx0dGhpcy50YXNrcyA9IFtdO1xyXG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdFx0XHQkaHR0cC5nZXQoJy91c2VyL3Rhc2tzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0XHR0aGF0LnRhc2tzID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y29udHJvbGxlckFzOiAnbXRsJ1xyXG5cdFx0fTtcclxuXHR9XSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG5cdC5kaXJlY3RpdmUoXCJwcm9qZWN0RGV0YWlsc1wiLCBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlc3RyaWN0OiBcIkVcIixcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvcHJvamVjdC1kZXRhaWxzLmh0bWwnXHJcblx0XHR9O1xyXG5cdH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuZGlyZWN0aXZlKFwicHJvamVjdFRhc2tzXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6IFwiRVwiLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9wcm9qZWN0LXRhc2tzLmh0bWwnXHJcblx0XHR9O1xyXG5cdH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuZGlyZWN0aXZlKFwidGFza0RldGFpbHNcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogXCJFXCIsXHJcblx0XHRcdHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL3Rhc2stZGV0YWlscy5odG1sJ1xyXG5cdFx0fTtcclxuXHR9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcblx0LmRpcmVjdGl2ZShcInRhc2tMaW5rXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVzdHJpY3Q6IFwiRVwiLFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy90YXNrLWxpbmsuaHRtbCdcclxuXHRcdH07XHJcblx0fSk7XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxyXG5cdC5zZXJ2aWNlKCdQcm9qZWN0UmVwb3NpdG9yeScsIFsgJyRyb290U2NvcGUnLCAnJGh0dHAnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0YWxsIDogZnVuY3Rpb24obW9kZWwpIHtcclxuXHRcdFx0XHQkaHR0cC5nZXQoJy9wcm9qZWN0Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0XHRtb2RlbC5hbGxQcm9qZWN0cyA9IGRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGZpbmQgOiBmdW5jdGlvbihpZCwgbW9kZWwpIHtcclxuXHRcdFx0XHQkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0bW9kZWwuY3VycmVudFByb2plY3QgPSB7fTtcclxuXHRcdFx0XHRcdG1vZGVsLmN1cnJlbnRQcm9qZWN0ID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YXV0aFVzZXIgOiBmdW5jdGlvbihtb2RlbCkge1xyXG5cdFx0XHRcdCRodHRwLmdldCgnL3VzZXIvcHJvamVjdHMnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdG1vZGVsLmF1dGhVc2VyUHJvamVjdHMgPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcblx0LnNlcnZpY2UoJ1Rhc2tSZXBvc2l0b3J5JywgWyAnJHJvb3RTY29wZScsICckaHR0cCcsIGZ1bmN0aW9uKCRyb290U2NvcGUsICRodHRwKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRhbGwgOiBmdW5jdGlvbihtb2RlbCkge1xyXG5cdFx0XHRcdCRodHRwLmdldCgnL3Rhc2snKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdG1vZGVsLmFsbFByb2plY3RzID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZmluZCA6IGZ1bmN0aW9uKHRhc2tJRCwgbW9kZWwpIHtcclxuXHRcdFx0XHQkaHR0cC5nZXQoJy90YXNrLycrdGFza0lEKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdG1vZGVsLmN1cnJlbnRUYXNrID0gZGF0YTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YnlQcm9qZWN0IDogZnVuY3Rpb24obW9kZWwpIHtcclxuXHRcdFx0XHQkaHR0cC5nZXQoJy9wcm9qZWN0LycraWQrJy90YXNrcycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0bW9kZWwudGFza3MgPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhdXRoVXNlciA6IGZ1bmN0aW9uKG1vZGVsKSB7XHJcblx0XHRcdFx0JGh0dHAuZ2V0KCcvdXNlci90YXNrcycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0bW9kZWwuYXV0aFVzZXJUYXNrcyA9IGRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuZmFjdG9yeSgnTWFpblZpZXdNb2RlbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuICAgICAgICAgICAgY29udGV4dDogXCJob21lXCIsXHJcbiAgICAgICAgICAgIHJpZ2h0Q29udGV4dDogXCJob21lXCIsXHJcbiAgICAgICAgICAgIGFsbFByb2plY3RzOiBbXSxcclxuXHRcdFx0YXV0aFVzZXJQcm9qZWN0czogW10sXHJcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IG51bGwsXHJcbiAgICAgICAgICAgIGN1cnJlbnRQcm9qZWN0OiB7fSxcclxuICAgICAgICAgICAgYWN0aXZlVGFzazogbnVsbCxcclxuICAgICAgICAgICAgY3VycmVudFRhc2s6IHt9LFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaXNBY3RpdmVQcm9qZWN0OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUHJvamVjdCA9PSBpbmRleCAmJiB0aGlzLmNvbnRleHQgPT0gXCJwcm9qZWN0XCI7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNldEFjdGl2ZVByb2plY3Q6IGZ1bmN0aW9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVByb2plY3QgPSBpbmRleDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaXNBY3RpdmVUYXNrOiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlVGFzayA9PSBpbmRleCAmJiB0aGlzLnJpZ2h0Q29udGV4dCA9PSBcInRhc2tcIjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2V0QWN0aXZlVGFzazogZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlVGFzayA9IGluZGV4O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXRDb250ZXh0OiBmdW5jdGlvbihjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXRSaWdodENvbnRleHQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0VGFza0xpbms6IGZ1bmN0aW9uKHRhc2spIHtcclxuICAgICAgICAgICAgICAgIHZhciB1cmwgPSAnIy9wcm9qZWN0LycrdGFzay5wcm9qZWN0X2lkO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlVGFzayh0YXNrLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybCA9IHVybCsnL3Rhc2svJyt0YXNrLmlkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybDtcclxuICAgICAgICAgICAgfVxyXG5cdFx0fTtcclxuXHR9KTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcblx0LmZhY3RvcnkoJ1NpZGViYXJWaWV3TW9kZWwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcbiAgICAgICAgICAgIGFsbFByb2plY3RzOiBbXSxcclxuXHRcdFx0YXV0aFVzZXJQcm9qZWN0czogW10sXHJcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IG51bGwsXHJcbiAgICAgICAgICAgIGlzQWN0aXZlUHJvamVjdDogZnVuY3Rpb24oaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFjdGl2ZVByb2plY3QgPT09IGluZGV4O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXRBY3RpdmVQcm9qZWN0OiBmdW5jdGlvbihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVQcm9qZWN0ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH07XHJcblx0fSk7XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9