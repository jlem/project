<?php namespace App\Domain\Project\Repository;

use App\Domain\Project\Project;
use App\Domain\Criteria;

class EloquentRepository implements Repository
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

    public function findByCriteria($Criteria)
    {
        if (!is_array($Criteria)) {
            $Criteria = [$Criteria];
        }

        foreach($Criteria as $C) {
            if ($C instanceof Criteria) {
                $this->Gateway = $this->Criteria->apply($this->Gateway, $this);
            }
        }

        return $this->Gateway->get();
    }
}
