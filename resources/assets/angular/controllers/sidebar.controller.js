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
