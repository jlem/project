<html ng-app="app">
	<head>
		<title>Tag Team</title>
		<link href='/css/app.css' rel='stylesheet' type='text/css'>
		<link href='//fonts.googleapis.com/css?family=Lato:100,300,400' rel='stylesheet' type='text/css'>
		<link href='//fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet' type='text/css'>
		<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:400,700' rel='stylesheet' type='text/css'>
		<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
		<script src="/js/angular/application.js"></script>
	</head>
	<body>
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
			<div class="panel" id="sidebar">
				<div id="ask-atom">
					<input name="ask" placeholder="Atom Search..." />
				</div>
				<div class="sidebar-heading">My Projects</div>
				<ul class="projects" ng-controller="SidebarController">
					<li ng-repeat="project in model.projects">
						<a id="project-pierce" href="/projects/pierce-command-zone">{{ project.name }}</a>
					</li>
				</ul>

				<div class="sidebar-heading">All Projects</div>
				<ul class="projects">
					<li><a href="/projects/pierce-command-zone">Access Health Connecticut</a></li>
					<li><a href="/projects/coinup">AgaMatrix Maintenance</a></li>
					<li><a href="/projects/tarn">Amy's International Sites</a></li>
					<li><a href="/projects/tarn">Avenue U - Popular Community Bank</a></li>
					<li><a href="/projects/tarn">AVS Maintenance 2015</a></li>
					<li><a href="/projects/tarn">Calico Jack Web Updates</a></li>
					<li><a href="/projects/tarn">CatchTrax</a></li>
					<li><a href="/projects/tarn">CHS Public Site Maintenance</a></li>
					<li><a href="/projects/tarn">CHS Round 2 Content Entry: CHC, GSN, GSH, SCN, OLC</a></li>
					<li><a href="/projects/tarn">CHS Round 2 Development: CHC, GSN, GSH, SCN, OLC</a></li>
					<li><a href="/projects/tarn">Clark Art Maintenance 2015</a></li>
					<li><a href="/projects/tarn">Conoco Phillips Maintenance</a></li>
					<li><a href="/projects/tarn">DivCom - TAPN, TARN, PVC, DAMC</a></li>
					<li><a href="/projects/tarn">EMC Maintenance</a></li>
					<li><a href="/projects/tarn">Harbor Blue QR Code</a></li>
					<li><a href="/projects/tarn">Hawthorn Creative Maintenance</a></li>
					<li><a href="/projects/tarn">Hosting Fees to Be Billed By Project</a></li>
					<li><a href="/projects/tarn">Hot Seat Maintenance 2014</a></li>
					<li><a href="/projects/tarn">Integrative Practitioner Website Migration</a></li>
					<li><a href="/projects/tarn">Internal Quality Assurance</a></li>
					<li><a href="/projects/tarn">Issue Tracker</a></li>
					<li><a href="/projects/tarn">Keds Picstyler - Bravehearts 2015</a></li>
					<li><a href="/projects/tarn">Kentico Renewals</a></li>
					<li><a href="/projects/tarn">none</a></li>
				</ul>
			</div>
			<div class="panel" id="panel">
				<div id="list">
				</div>
				<div id="details">
				</div>
			</div>
		</div>
	</body>
</html>