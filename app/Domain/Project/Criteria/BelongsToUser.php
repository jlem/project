<?php namespace App\Domain\Project\Criteria;

use App\Domain\Criteria;
use App\User;

class BelongsToUser implements Criteria
{
    protected $User;

    public function __construct(User $User)
    {
        $this->User = $User;
    }

    public function apply($gateway, $repository)
    {
        return $this->User->projects();
    }
}
