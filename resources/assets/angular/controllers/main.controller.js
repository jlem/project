(function() {
	angular
        .module('app')
	    .controller("MainController", MainController);

    MainController.$inject = ['MainViewModel'];

    function MainController(MainViewModel) {
        this.vm = MainViewModel;
    }
})();