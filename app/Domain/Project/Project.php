<?php namespace App\Domain\Project;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Task\Task;
use App\Client;
use App\User;

class Project extends Model 
{
	protected $appends = ['authorizedUserTasks'];

	public function users()
	{
		return $this->belongsToMany(User::class);
	}

	public function tasks()
	{
		return $this->hasMany(Task::class);
	}

	public function getAuthorizedUserTasksAttribute()
	{
		$User = User::find(1);
		return $this->tasks->filter(function($Task) use ($User) {
            return $Task->belongsToUser($User);
        });
	}
}