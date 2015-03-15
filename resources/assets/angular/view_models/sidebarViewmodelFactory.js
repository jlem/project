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