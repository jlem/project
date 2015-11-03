(function() {
	angular
        .module('app')
        .directive("myTaskList", myTaskList);

    myTaskList.$inject = ['$http'];

    function myTaskList($http) {
        return {
            restrict: "E",
            templateUrl: '/partials/my-task-list.html',
            controller: function($http) {
                this.tasks = [];
                var self = this;
                $http.get('/user/tasks').success(function(data) {
                    self.tasks = data;
                });
            },
            controllerAs: 'mtl'
        };
    }
})();