(function() {
	angular.module('app', [])
	.controller("SidebarController", ["$scope", "ProjectRepository", "SidebarViewModel", function($scope, ProjectRepository, SidebarViewModel) {
		$scope.model = SidebarViewModel;
		ProjectRepository.all($scope.model);
        ProjectRepository.authUser($scope.model);
	}]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic2VydmljZXMvcHJvamVjdHNfcmVwb3NpdG9yeS5qcyIsInZpZXdfbW9kZWxzL3NpZGViYXJWaWV3bW9kZWxGYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJywgW10pXG5cdC5jb250cm9sbGVyKFwiU2lkZWJhckNvbnRyb2xsZXJcIiwgW1wiJHNjb3BlXCIsIFwiUHJvamVjdFJlcG9zaXRvcnlcIiwgXCJTaWRlYmFyVmlld01vZGVsXCIsIGZ1bmN0aW9uKCRzY29wZSwgUHJvamVjdFJlcG9zaXRvcnksIFNpZGViYXJWaWV3TW9kZWwpIHtcblx0XHQkc2NvcGUubW9kZWwgPSBTaWRlYmFyVmlld01vZGVsO1xuXHRcdFByb2plY3RSZXBvc2l0b3J5LmFsbCgkc2NvcGUubW9kZWwpO1xuICAgICAgICBQcm9qZWN0UmVwb3NpdG9yeS5hdXRoVXNlcigkc2NvcGUubW9kZWwpO1xuXHR9XSk7XG59KSgpOyIsIihmdW5jdGlvbigpIHtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cdC5zZXJ2aWNlKCdQcm9qZWN0UmVwb3NpdG9yeScsIFsgJyRyb290U2NvcGUnLCAnJGh0dHAnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkaHR0cCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRhbGwgOiBmdW5jdGlvbihtb2RlbCkge1xuXHRcdFx0XHQkaHR0cC5nZXQoJy9wcm9qZWN0Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRcdFx0bW9kZWwuYWxsUHJvamVjdHMgPSBkYXRhO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0sXG5cdFx0XHRhdXRoVXNlciA6IGZ1bmN0aW9uKG1vZGVsKSB7XG5cdFx0XHRcdCRodHRwLmdldCgnL3VzZXIvcHJvamVjdHMnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHRtb2RlbC5hdXRoVXNlclByb2plY3RzID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuZmFjdG9yeSgnU2lkZWJhclZpZXdNb2RlbCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG4gICAgICAgICAgICBhbGxQcm9qZWN0czogW10sXG5cdFx0XHRhdXRoVXNlclByb2plY3RzOiBbXSxcbiAgICAgICAgICAgIGFjdGl2ZVByb2plY3Q6IG51bGwsXG4gICAgICAgICAgICBpc0FjdGl2ZVByb2plY3Q6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWN0aXZlUHJvamVjdCA9PT0gaW5kZXg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0QWN0aXZlUHJvamVjdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZVByb2plY3QgPSBpbmRleDtcbiAgICAgICAgICAgIH1cblx0XHR9O1xuXHR9KTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9