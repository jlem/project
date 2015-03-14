(function() {
	angular.module('app', [])
	.controller("SidebarController", ["$scope", "ProjectRepository", "SidebarViewModel", function($scope, ProjectRepository, SidebarViewModel) {
		$scope.model = SidebarViewModel;
		ProjectRepository.all($scope.model);
	}]);
})();
(function() {
	angular.module('app')
	.service('ProjectRepository', [ '$rootScope', '$http', function($rootScope, $http) {
		return {
			all : function(model) {
				$http.get('/project').success(function(data) {
					model.projects = data;
				});
			}
		};
	}]);
})();
(function() {
	angular.module('app')
	.factory('SidebarViewModel', function() {
		return {
			projects: []
		};
	});
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic2VydmljZXNcXHByb2plY3RzX3JlcG9zaXRvcnkuanMiLCJ2aWV3X21vZGVsc1xcc2lkZWJhclZpZXdtb2RlbEZhY3RvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXSlcclxuXHQuY29udHJvbGxlcihcIlNpZGViYXJDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCIsIFwiU2lkZWJhclZpZXdNb2RlbFwiLCBmdW5jdGlvbigkc2NvcGUsIFByb2plY3RSZXBvc2l0b3J5LCBTaWRlYmFyVmlld01vZGVsKSB7XHJcblx0XHQkc2NvcGUubW9kZWwgPSBTaWRlYmFyVmlld01vZGVsO1xyXG5cdFx0UHJvamVjdFJlcG9zaXRvcnkuYWxsKCRzY29wZS5tb2RlbCk7XHJcblx0fV0pO1xyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuXHRhbmd1bGFyLm1vZHVsZSgnYXBwJylcclxuXHQuc2VydmljZSgnUHJvamVjdFJlcG9zaXRvcnknLCBbICckcm9vdFNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHApIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdGFsbCA6IGZ1bmN0aW9uKG1vZGVsKSB7XHJcblx0XHRcdFx0JGh0dHAuZ2V0KCcvcHJvamVjdCcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdFx0bW9kZWwucHJvamVjdHMgPSBkYXRhO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1dKTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcpXHJcblx0LmZhY3RvcnkoJ1NpZGViYXJWaWV3TW9kZWwnLCBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHByb2plY3RzOiBbXVxyXG5cdFx0fTtcclxuXHR9KTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=