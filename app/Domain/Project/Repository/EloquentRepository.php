<?php namespace App\Domain\Project\Repository;

use App\Domain\Project\Project;
use App\Domain\Criteria;
use App\User;

class EloquentRepository implements RepositoryInterface
{
    protected $Gateway;

    public function __construct(Project $Gateway)
    {
        $this->Gateway = $Gateway;
    }

    public function all()
    {
        return $this->Gateway->all();
    }

    public function findByID($id)
    {
        return $this->Gateway->with('tasks.owner', 'users')->find($id);
    }

    public function findByUser(User $User)
    {
        return $User->projects;
    }

    public function findByCriteria($Criteria)
    {
        if (!is_array($Criteria)) {
            $Criteria = [$Criteria];
        }

        foreach($Criteria as $C) {
            if ($C instanceof Criteria) {
                $this->Gateway = $C->apply($this->Gateway, $this);
            }
        }

        return $this->Gateway->get();
    }
}
