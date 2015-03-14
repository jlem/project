<?php namespace App\Http\Controllers;

class ProjectController extends Controller {

	public function index()
	{
		return [
			['name' => 'Project 1'],
			['name' => 'Project 2']
		];
	}

}
