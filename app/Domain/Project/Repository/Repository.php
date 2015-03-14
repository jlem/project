<?php namespace App\Domain\Project\Repository;

interface Repository
{
    public function all();
    public function findByCriteria($Criteria);
}
