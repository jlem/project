<?php namespace App\Http\Controllers;

use App\Domain\Project\Repository\EloquentRepository as Repository;
use App\Domain\Project\Criteria\BelongsToUser;
use App\User;

class WelcomeController extends Controller {

	protected $Repository;

	public function __construct(Repository $Repository)
	{
		$this->Repository = $Repository;
	}

	/**
	 * Show the application welcome screen to the user.
	 *
	 * @return Response
	 */
	public function index()
	{
		$User = User::find(1);
		dd(new BelongsToUser($User));
		dd($this->Repository->findByCritera(new BelongsToUser($User)));
		/*return view('angular.app');*/
	}

}
