<?php namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Domain\Project\Project;

class Client extends Model
{
    public function projects()
    {
        $this->hasMany(Project::class);
    }

}
