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
