<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Faker\Factory;
use App\User;
use App\Client;
use App\Domain\Project\Project;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	protected $faker;

	public function run()
	{
		Model::unguard();
		$this->faker = Factory::create();
		$this->users();
		$this->clients();
		$this->projects();
		$this->userProjects();
	}

	public function users()
	{
		DB::table('users')->truncate();
		User::create([
			'first_name' => 'Jon',
			'last_name' => 'LeMaitre',
			'type' => 3,
			'password' => \Hash::make('password'),
			'email' => 'jlemaitre@theatomgroup.com'
		]);
	}

	public function clients()
	{
		DB::table('clients')->truncate();
		for($i=0; $i<51; $i++) {
			Client::create([
				'name' => $this->faker->company
			]);
		}
	}

	public function projects()
	{
		DB::table('projects')->truncate();
		$projects = [
			'Access Health Connecticut',
			'AgaMatrix Maintenance',
			'Amy\'s International Sites',
			'Avenue U - Popular Community Bank',
			'AVS Maintenance 2015',
			'Calico Jack Web Updates',
			'CatchTrax',
			'CHS Public Site Maintenance',
			'CHS Round 2 Content Entry: CHC, GSN, GSH, SCN, OLC',
			'CHS Round 2 Development: CHC, GSN, GSH, SCN, OLC',
			'Clark Art Maintenance 2015',
			'Conoco Phillips Maintenance',
			'DivCom - TAPN, TARN, PVC, DAMC',
			'EMC Maintenance',
			'Harbor Blue QR Code',
			'Hawthorn Creative Maintenance',
			'Hosting Fees to Be Billed By Project',
			'Hot Seat Maintenance 2014',
			'Integrative Practitioner Website Migration',
			'Internal Quality Assurance',
			'Issue Tracker',
			'Keds Picstyler - Bravehearts 2015',
			'Kentico Renewals',
			'Legit Kentico Training!',
			'Lighthouse Placement Services Maintenance',
			'Little White Book Maintenance',
			'Little White Book - Wedding Planning Site LWB.com',
			'LuxeDH Development Support',
			'MCLA Maintenance',
			'Pierce Command Zone',
			'Pierce Manufacturing 2015 Maintenance',
			'Pierce Website Development',
			'Play Mechanix Ongoing Support',
			'Presidential Bank Mortgage Site',
			'Presidential Bank Site Maintenance',
			'Puddle Dock Pond Rink',
			'Rep Institute Ongoing Work',
			'Reverse FAT SPEC',
			'Rue La La A/B Testing NEW',
			'Rue La La Blog',
			'Rue La La Browser Extension',
			'Seaport Maintenance 2015',
			'Server Room - Restructure',
			'Syncplicity 2015 Q1',
			'Syncplicity Maintenance Q3 + Q4',
			'TAG Internal',
			'TAG Process Site Feedback',
			'TAG.com Bear On Unicycle Redesign',
			'TAGTeam - TAGTask Phase 1',
			'Technical Operations',
			'TrueFit Universal App',
			'Vacation'
		];

		for($i=1; $i<count($projects); $i++) {
			Project::create([
				'name' => $projects[$i-1],
				'client_id' => $i,
				'status' => 1,
				'type' => 1
			]);
		}
	}

	public function userProjects()
	{
		DB::table('project_user')->truncate();
		DB::table('project_user')->insert([
		[
			'project_id' => 3,
			'user_id' => 1,
			'role' => 2
		],
		[
			'project_id' => 6,
			'user_id' => 1,
			'role' => 1
		],
		[
			'project_id' => 15,
			'user_id' => 1,
			'role' => 4
		]]);
	}
}
