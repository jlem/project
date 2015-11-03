(function() {
	angular
        .module('app')
	    .controller("MainController", MainController);

    MainController.$inject = ['ApplicationState'];

    function MainController(ApplicationState) {
        this.vm = ApplicationState;
    }
})();