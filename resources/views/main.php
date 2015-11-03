<html ng-app="app">
    <head>
        <title>Tag Team</title>
        <link href='/css/app.css' rel='stylesheet' type='text/css'>
        <link href='//fonts.googleapis.com/css?family=Lato:100,300,400' rel='stylesheet' type='text/css'>
        <link href='//fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
        <link href='//fonts.googleapis.com/css?family=Roboto+Condensed:400,700' rel='stylesheet' type='text/css'>
        <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
        <script src="/js/angular/angular-route.min.js"></script>
        <script src="/js/angular/application.js"></script>
    </head>
    <body ng-controller="MainController as main">
        <div id="header">
            <ng-view></ng-view>
            <div id="logo" class="left column">
                <img src="/images/logo.png" />
            </div>
            <div id="calendar" class="column">
                <a href="#" id="monday" ng-click="main.vm.setContext('time')">monday 3.9</a>
                <a href="#" id="tuesday" ng-click="main.vm.setContext('time')">tuesday 3.10</a>
                <a href="#" id="wednesday" ng-click="main.vm.setContext('time')">wednesday 3.11</a>
                <a href="#" id="thursday" ng-click="main.vm.setContext('time')">thursday 3.12</a>
                <a href="#" id="friday" class="active" ng-click="main.vm.setContext('time')">friday 3.13</a>
            </div>
        </div>
        <div id="content">
            <div id="sidebar" class="left panel" ng-controller="SidebarController">
                <div id="ask-atom">
                    <input name="ask" placeholder="Atom Search..." />
                </div>
                <div class="sidebar-heading">My Projects</div>
                <ul class="projects">
                    <li ng-repeat="project in main.vm.getAuthUserProjects()">
                        <a href="#/project/{{project.id}}" ng-class="{ active:main.vm.isActiveProject(project.id) }">{{ project.name }}</a>
                    </li>
                </ul>

                <div class="sidebar-heading">All Projects</div>
                <ul class="projects">
                    <li ng-repeat="project in main.vm.getAllProjects()">
                        <a href="#/project/{{project.id}}" ng-class="{ active:main.vm.isActiveProject(project.id) }">{{ project.name }}</a>
                    </li>
                </ul>
            </div>
            <div id="panel1" class="center panel" ng-switch="main.vm.getContext()">
                <div ng-switch-when="home">
                    <my-task-list></my-task-list>
                </div>
                <div ng-switch-when="project">
                    <project-tasks></project-tasks>
                </div>
                <div ng-switch-when="time">Track time</div>
            </div>
            <div id="panel2" class="right panel" ng-switch="main.vm.getRightContext()">
                <div ng-switch-when="home">???</div>
                <div ng-switch-when="project">
                    <project-details></project-details>
                </div>
                <div ng-switch-when="task">
                    <task-details></task-details>
                </div>
            </div>
        </div>
        <div id="footer"></div>
    </body>
</html>
