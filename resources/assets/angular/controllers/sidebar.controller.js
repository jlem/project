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
