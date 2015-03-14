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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2plY3RfbW9kdWxlLmpzIiwic2VydmljZXMvcHJvamVjdHNfcmVwb3NpdG9yeS5qcyIsInZpZXdfbW9kZWxzL3NpZGViYXJWaWV3bW9kZWxGYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcblx0YW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtdKVxuXHQuY29udHJvbGxlcihcIlNpZGViYXJDb250cm9sbGVyXCIsIFtcIiRzY29wZVwiLCBcIlByb2plY3RSZXBvc2l0b3J5XCIsIFwiU2lkZWJhclZpZXdNb2RlbFwiLCBmdW5jdGlvbigkc2NvcGUsIFByb2plY3RSZXBvc2l0b3J5LCBTaWRlYmFyVmlld01vZGVsKSB7XG5cdFx0JHNjb3BlLm1vZGVsID0gU2lkZWJhclZpZXdNb2RlbDtcblx0XHRQcm9qZWN0UmVwb3NpdG9yeS5hbGwoJHNjb3BlLm1vZGVsKTtcblx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuc2VydmljZSgnUHJvamVjdFJlcG9zaXRvcnknLCBbICckcm9vdFNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJGh0dHApIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0YWxsIDogZnVuY3Rpb24obW9kZWwpIHtcblx0XHRcdFx0JGh0dHAuZ2V0KCcvcHJvamVjdCcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRcdG1vZGVsLnByb2plY3RzID0gZGF0YTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fV0pO1xufSkoKTsiLCIoZnVuY3Rpb24oKSB7XG5cdGFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXHQuZmFjdG9yeSgnU2lkZWJhclZpZXdNb2RlbCcsIGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRwcm9qZWN0czogW11cblx0XHR9O1xuXHR9KTtcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9