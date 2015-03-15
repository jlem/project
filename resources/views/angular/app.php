<html ng-app="app">
	<head>
		<title>Tag Team</title>
		<link href='/css/app.css' rel='stylesheet' type='text/css'>
		<link href='//fonts.googleapis.com/css?family=Lato:100,300,400' rel='stylesheet' type='text/css'>
		<link href='//fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:400,700' rel='stylesheet' type='text/css'>
		<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
		<script src="/js/angular/angular-route.min.js"></script>
		<script src="/js/angular/application.js"></script>
	</head>
	<body>
		<div id="wrapper">
			<div id="header"></div>
			<div id="content">
				<div id="left"></div>
				<div id="center"></div>
				<div id="right"></div>
			</div>
			<div id="footer"></div>
		</div>
		</div>
		<div id="navbar">
			<div class="navbar-section" id="logo">
				<img src="/images/logo.png" />
			</div>
			<div class="navbar-section" id="calendar">
				<a href="#" id="monday">monday 3.9</a>
				<a href="#" id="tuesday">tuesday 3.10</a>
				<a href="#" id="wednesday">wednesday 3.11</a>
				<a href="#" id="thursday">thursday 3.12</a>
				<a href="#" id="friday" class="active">friday 3.13</a>
			</div>
			<div class="navbar-section" id="nav"></div>
		</div>
		<div id="body">
			<div class="panel" id="sidebar" ng-controller="SidebarController">
				<div id="ask-atom">
					<input name="ask" placeholder="Atom Search..." />
				</div>
				<div class="sidebar-heading">My Projects</div>
				<ul class="projects">
					<li ng-repeat="project in model.authUserProjects">
						<a id="project-pierce" href ng-click="model.setActiveProject(project.id)" ng-class="{ active:model.isActiveProject(project.id) }">{{ project.name }}</a>
					</li>
				</ul>

			</div>
			<div class="panel" id="panel">
				<div id="list">
				</div>
				<div id="details">
				</div>
			</div>
			<div style="clear:both;"></div>
		</div>
	</body>
</html>
