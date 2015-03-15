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
    <body>
        <div id="header">
            <div id="logo" class="left column">
                <img src="/images/logo.png" />
            </div>
            <div id="calendar" class="center column">
                <a href="#" id="monday">monday 3.9</a>
                <a href="#" id="tuesday">tuesday 3.10</a>
                <a href="#" id="wednesday">wednesday 3.11</a>
                <a href="#" id="thursday">thursday 3.12</a>
                <a href="#" id="friday" class="active">friday 3.13</a>
            </div>
            <div id="navigation" class="right column"></div>
        </div>
        <div id="content">
            <div id="sidebar" class="left panel" ng-controller="SidebarController">
                <div id="ask-atom">
                    <input name="ask" placeholder="Atom Search..." />
                </div>
                <div class="sidebar-heading">My Projects</div>
                <ul class="projects">
                    <li ng-repeat="project in model.authUserProjects">
                        <a id="project-pierce" href ng-click="model.setActiveProject(project.id)" ng-class="{ active:model.isActiveProject(project.id) }">{{ project.name }}</a>
                    </li>
                </ul>

                <div class="sidebar-heading">All Projects</div>
                <ul class="projects">
                    <li ng-repeat="project in model.allProjects">
                        <a id="project-pierce" href ng-click="model.setActiveProject(project.id)" ng-class="{ active:model.isActiveProject(project.id) }">{{ project.name }}</a>
                    </li>
                </ul>
            </div>
            <div id="panel1" class="center panel"></div>
            <div id="panel2" class="right panel"></div>
        </div>
        <div id="footer">hey</div>
    </body>
</html>
