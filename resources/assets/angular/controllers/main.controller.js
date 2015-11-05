(function() {
	angular
    .module('app')
    .controller("MainController", MainController);

    MainController.$inject = ['ApplicationState'];

    function MainController(ApplicationState) {
        this.vm = ApplicationState;
    }
})()8dbc91f7e62c1df80259dfd7124be19f875cb2b2;