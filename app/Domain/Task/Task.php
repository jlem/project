<?php namespace App\Domain\Task;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Project\Project;
use App\Client;
use App\User;

class Task extends Model 
{
	public function owner()
	{
		return $this->belongsTo(User::class, 'owner');
	}

	public function project()
	{
		return $this->belongsTo(Project::class);
	}

	public function belongsToUser(User $User)
	{
		return $this->owner == $User->id;
	}
}
