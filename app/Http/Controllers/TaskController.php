<?php namespace App\Http\Controllers;

use App\User;
use App\Domain\Task\Task;

class TaskController extends Controller {

	public function index()
	{
        return $this->Repository->all();
	}

    public function show($id)
    {
        return Task::with('owner')->find($id);
    }

    public function byUser()
    {
        $User = User::find(1);
        return $User->tasks;
    }
}
